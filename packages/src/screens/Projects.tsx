import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { Loading } from '../components/Loading.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useProjectStore } from '../store/project.js';
import type { Route } from '../types/index.js';

interface ProjectsProps {
  goTo: (route: Route) => void;
}

export function Projects({ goTo }: ProjectsProps) {
  const { projects, isLoadingProjects, fetchProjects, selectProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const filtered = searchQuery
    ? projects.filter((p) => p.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  useKeyboard({
    onUp: () => !isSearching && setSelectedIndex((i) => (i > 0 ? i - 1 : Math.max(0, filtered.length - 1))),
    onDown: () => !isSearching && setSelectedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0)),
    onEnter: () => {
      if (isSearching) { setIsSearching(false); return; }
      const p = filtered[selectedIndex];
      if (p) { selectProject(p); goTo('project'); }
    },
    onEscape: () => {
      if (isSearching) { setIsSearching(false); setSearchQuery(''); }
      else goTo('dashboard');
    },
    onSlash: () => { if (!isSearching) setIsSearching(true); },
  });

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Intro */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        {isSearching ? (
          <Box gap={1}>
            <Text color="cyan">›</Text>
            <TextInput
              value={searchQuery}
              onChange={(v) => { setSearchQuery(v); setSelectedIndex(0); }}
              placeholder="filter projects…"
            />
            {searchQuery && <Text color="gray" dimColor>({filtered.length})</Text>}
          </Box>
        ) : (
          <Text color="gray" dimColor>
            select a project  <Text color="cyan">/</Text> to search
          </Text>
        )}
      </Box>

      {/* List */}
      <Box flexDirection="column" gap={0}>
        {isLoadingProjects ? (
          <Box paddingLeft={2}><Loading label="fetching projects…" /></Box>
        ) : filtered.length === 0 ? (
          <Box paddingLeft={2}>
            <Text color="gray" dimColor>
              {searchQuery ? `no projects match "${searchQuery}"` : 'no projects found'}
            </Text>
          </Box>
        ) : (
          filtered.map((project, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Box key={project._id} gap={2}>
                <Text color={isSelected ? 'cyan' : 'gray'}>{isSelected ? '›' : ' '}</Text>
                <Text color={isSelected ? 'cyan' : 'gray'} bold={isSelected}>{project.projectName}</Text>
                <Text color="gray" dimColor>{project.secretCount != null ? `${project.secretCount} secrets` : ''}</Text>
              </Box>
            );
          })
        )}
      </Box>

      {/* Outro */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>
          {isSearching ? 'enter confirm  · esc cancel' : '↑↓ navigate  · enter open  · / search  · esc back'}
        </Text>
      </Box>

    </Box>
  );
}
