import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useProjectStore } from '../store/project.js';
import { useScrollback } from '../store/scrollback.js';
import { KeyHints } from '../components/KeyHints.js';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import { caret } from '../theme/icons.js';
import type { Route } from '../types/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ProjectScreenProps {
  goTo: (route: Route) => void;
}

const actions = [
  { value: 'pull' as const,    label: 'pull .env', hint: 'write secrets to .env file' },
  { value: 'refresh' as const, label: 'refresh',   hint: 'reload secrets from server' },
  { value: 'back' as const,    label: 'back',      hint: 'return to projects list' },
];

const listHints = [
  { key: 'enter', label: 'actions' },
  { key: 'esc', label: 'back' },
];

const actionHints = [
  { key: '↑↓', label: 'navigate' },
  { key: 'enter', label: 'run' },
  { key: 'esc', label: 'cancel' },
];

export function ProjectScreen({ goTo }: ProjectScreenProps) {
  const { columns } = useTerminalSize();
  const boxWidth = Math.min(72, Math.max(40, columns - 8));
  const { selectedProject, secrets, isLoadingSecrets, secretsError, fetchSecrets } = useProjectStore();
  const { push } = useScrollback();
  const [actionIndex, setActionIndex] = useState(0);
  const [actionsActive, setActionsActive] = useState(false);
  const [pullMessage, setPullMessage] = useState<string | null>(null);
  const spinner = useSpinnerFrame();

  useEffect(() => { if (selectedProject) fetchSecrets(selectedProject._id); }, [selectedProject]);
  useEffect(() => { if (!selectedProject) goTo('projects'); }, [selectedProject]);

  useKeyboard({
    onUp: () => actionsActive && setActionIndex((i) => (i > 0 ? i - 1 : actions.length - 1)),
    onDown: () => actionsActive && setActionIndex((i) => (i < actions.length - 1 ? i + 1 : 0)),
    onEnter: () => {
      if (!actionsActive) { setActionsActive(true); return; }
      const a = actions[actionIndex];
      if (a.value === 'pull') {
        try {
          const content = secrets.map((s) => `${s.secName}=${s.secKey.replace(/;e$/, '')}`).join('\n');
          const fp = path.join(process.cwd(), '.env');
          fs.writeFileSync(fp, content, 'utf-8');
          setPullMessage(`${secrets.length} secret${secrets.length !== 1 ? 's' : ''} written → ${fp}`);
          push('success', `.env saved`, fp);
        } catch (err: any) {
          setPullMessage(`failed: ${err?.message ?? 'unknown error'}`);
        }
      } else if (a.value === 'refresh' && selectedProject) fetchSecrets(selectedProject._id);
      else goTo('projects');
    },
    onEscape: () => { if (actionsActive) { setActionsActive(false); setPullMessage(null); } else goTo('projects'); },
  });

  if (!selectedProject) return null;

  return (
    <Box flexDirection="column" alignItems="center" gap={1}>
      <Box
        borderStyle="round"
        borderColor={colors.border}
        paddingX={1}
        flexDirection="column"
        width={boxWidth}
      >
        <Box gap={1}>
          <Text color={colors.textSecondary}>{selectedProject.projectName}</Text>
          <Text color={colors.textDim}>{secrets.length} secret{secrets.length !== 1 ? 's' : ''}</Text>
        </Box>

        {isLoadingSecrets ? (
          <Box gap={1}>
            <Text color={colors.accent}>{spinner}</Text>
            <Text color={colors.textSecondary}>fetching secrets...</Text>
          </Box>
        ) : secretsError ? (
          <Box flexDirection="column" gap={0}>
            <Text color={colors.error}>{secretsError}</Text>
            <Text color={colors.textDim}>press esc to go back</Text>
          </Box>
        ) : secrets.length === 0 ? (
          <Text color={colors.textDim}>no secrets found</Text>
        ) : (
          <Box flexDirection="column" gap={0}>
            {secrets.map((s) => (
              <Box key={s._id} gap={1}>
                <Text color={colors.textSecondary}>{s.secName}</Text>
                <Text color={colors.textDim}>{'••••••••'}</Text>
              </Box>
            ))}
          </Box>
        )}

        {actionsActive && !pullMessage && (
          <Box flexDirection="column" gap={0}>
            {actions.map((item, index) => {
              const isSel = index === actionIndex;
              return (
                <Box key={item.value} gap={1}>
                  <Text color={isSel ? colors.accent : colors.textDim}>{isSel ? caret : ' '}</Text>
                  <Text color={isSel ? colors.accent : colors.textSecondary} bold={isSel}>{item.label}</Text>
                  <Text color={colors.textDim}>{item.hint}</Text>
                </Box>
              );
            })}
          </Box>
        )}
        {pullMessage && (
          <Box flexDirection="column" gap={0}>
            <Text color={colors.success}>{pullMessage}</Text>
            <Text color={colors.textDim}>press esc to dismiss</Text>
          </Box>
        )}
      </Box>

      <KeyHints hints={actionsActive ? actionHints : listHints} />
    </Box>
  );
}
