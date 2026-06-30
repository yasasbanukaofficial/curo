import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Loading } from '../components/Loading.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useProjectStore } from '../store/project.js';
import type { Route } from '../types/index.js';

interface ProjectScreenProps {
  goTo: (route: Route) => void;
}

const actions = [
  { value: 'pull',    label: 'pull .env', hint: 'sync secrets into .env file'  },
  { value: 'refresh', label: 'refresh',   hint: 'reload secrets from server'    },
  { value: 'back',    label: 'back',      hint: 'return to projects list'        },
] as const;

export function ProjectScreen({ goTo }: ProjectScreenProps) {
  const { selectedProject, secrets, isLoadingSecrets, fetchSecrets } = useProjectStore();
  const [actionIndex, setActionIndex] = useState(0);
  const [actionsActive, setActionsActive] = useState(false);

  useEffect(() => { if (selectedProject) fetchSecrets(selectedProject._id); }, [selectedProject]);
  useEffect(() => { if (!selectedProject) goTo('projects'); }, [selectedProject]);

  useKeyboard({
    onUp: () => actionsActive && setActionIndex((i) => (i > 0 ? i - 1 : actions.length - 1)),
    onDown: () => actionsActive && setActionIndex((i) => (i < actions.length - 1 ? i + 1 : 0)),
    onEnter: () => {
      if (!actionsActive) { setActionsActive(true); return; }
      const a = actions[actionIndex]!;
      if (a.value === 'pull') goTo('pull');
      else if (a.value === 'refresh' && selectedProject) fetchSecrets(selectedProject._id);
      else goTo('projects');
    },
    onEscape: () => { if (actionsActive) setActionsActive(false); else goTo('projects'); },
  });

  if (!selectedProject) return null;

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Project identity */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="white" bold>{selectedProject.projectName}</Text>
        <Text color="gray" dimColor>· {secrets.length} secret{secrets.length !== 1 ? 's' : ''}</Text>
      </Box>

      {/* Secrets */}
      <Box flexDirection="column" gap={0}>
        {isLoadingSecrets ? (
          <Box paddingLeft={2}><Loading label="fetching secrets…" /></Box>
        ) : secrets.length === 0 ? (
          <Box paddingLeft={2}><Text color="gray" dimColor>no secrets found</Text></Box>
        ) : (
          secrets.map((s, i) => (
            <Box key={s._id} gap={2} paddingLeft={2}>
              <Text color="gray" dimColor>{String(i + 1).padStart(2, ' ')}.</Text>
              <Text color="cyan">{s.secName}</Text>
              <Text color="gray" dimColor>{'·'.repeat(8)}</Text>
            </Box>
          ))
        )}
      </Box>

      {/* Actions section — mirrors clack select */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>{actionsActive ? 'choose an action' : 'press enter to act'}</Text>
      </Box>

      {actionsActive && (
        <Box flexDirection="column" gap={0}>
          {actions.map((item, index) => {
            const isSelected = index === actionIndex;
            return (
              <Box key={item.value} gap={2}>
                <Text color={isSelected ? 'cyan' : 'gray'}>{isSelected ? '›' : ' '}</Text>
                <Text color={isSelected ? 'cyan' : 'gray'} bold={isSelected}>{item.label}</Text>
                <Text color="gray" dimColor>{item.hint}</Text>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Outro */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>
          {actionsActive ? '↑↓ navigate  · enter run  · esc cancel' : 'enter actions  · esc back'}
        </Text>
      </Box>

    </Box>
  );
}
