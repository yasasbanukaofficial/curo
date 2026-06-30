import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useProjectStore } from '../store/project.js';
import { useScrollback } from '../store/scrollback.js';
import { KeyHints } from '../components/KeyHints.js';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import { caret } from '../theme/icons.js';
import type { Route } from '../types/index.js';

interface ProjectsProps {
  goTo: (route: Route) => void;
}

const hints = [
  { key: '↑↓', label: 'navigate' },
  { key: '/', label: 'search' },
  { key: 'enter', label: 'open' },
  { key: 'esc', label: 'back' },
];

export function Projects({ goTo }: ProjectsProps) {
  const { columns } = useTerminalSize();
  const boxWidth = Math.min(72, Math.max(40, columns - 8));
  const { projects, isLoadingProjects, projectsError, fetchProjects, selectProject } = useProjectStore();
  const { push } = useScrollback();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const spinner = useSpinnerFrame();

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
      if (p) {
        selectProject(p);
        push('info', `Selected project: ${p.projectName}`);
        goTo('project');
      }
    },
    onEscape: () => {
      if (isSearching) { setIsSearching(false); setSearchQuery(''); }
      else goTo('dashboard');
    },
    onSlash: () => { if (!isSearching) setIsSearching(true); },
  });

  return (
    <Box flexDirection="column" alignItems="center" gap={1}>
      <Box
        borderStyle="round"
        borderColor={colors.border}
        paddingX={1}
        flexDirection="column"
        width={boxWidth}
      >
        {isSearching && (
          <Box gap={1}>
            <Text color={colors.textDim}>{caret}</Text>
            <TextInput
              value={searchQuery}
              onChange={(v) => { setSearchQuery(v); setSelectedIndex(0); }}
              placeholder="filter projects..."
            />
            {searchQuery && <Text color={colors.textDim}>({filtered.length})</Text>}
          </Box>
        )}

        {isLoadingProjects ? (
          <Box gap={1}>
            <Text color={colors.accent}>{spinner}</Text>
            <Text color={colors.textSecondary}>fetching projects...</Text>
          </Box>
        ) : projectsError ? (
          <Box flexDirection="column" gap={0}>
            <Text color={colors.error}>{projectsError}</Text>
            <Text color={colors.textDim}>press esc to go back</Text>
          </Box>
        ) : filtered.length === 0 ? (
          <Text color={colors.textDim}>
            {searchQuery ? `no projects match "${searchQuery}"` : 'no projects found'}
          </Text>
        ) : (
          <Box flexDirection="column" gap={0}>
            {filtered.map((project, index) => {
              const isSel = index === selectedIndex;
              return (
                <Box key={project._id} gap={1}>
                  <Text color={isSel ? colors.accent : colors.textDim}>{isSel ? caret : ' '}</Text>
                  <Text color={isSel ? colors.accent : colors.textSecondary} bold={isSel}>{project.projectName}</Text>
                  {project.secretCount != null && (
                    <Text color={colors.textDim}>{project.secretCount} secrets</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <KeyHints hints={hints} />
    </Box>
  );
}
