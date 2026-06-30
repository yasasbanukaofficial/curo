import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useAuthStore } from '../store/auth.js';
import { useProjectStore } from '../store/project.js';
import { CommandInput } from '../components/CommandInput.js';
import { KeyHints } from '../components/KeyHints.js';
import { TipLine } from '../components/TipLine.js';
import * as colors from '../theme/colors.js';
import type { Route } from '../types/index.js';

interface DashboardProps {
  goTo: (route: Route) => void;
}

const commands: { cmd: string; route: Route; desc: string }[] = [
  { cmd: '/projects', route: 'projects', desc: 'Browse projects' },
  { cmd: '/settings', route: 'settings', desc: 'Credentials, config, and version info' },
  { cmd: '/logout', route: 'logout', desc: 'Sign out and clear local session' },
  { cmd: '/login', route: 'login', desc: 'Switch account' },
];

const hints = [
  { key: 'type /', label: 'for commands' },
  { key: '↑↓', label: 'navigate' },
  { key: 'enter', label: 'select' },
  { key: 'esc', label: 'clear' },
];

const tipSegments = [
  { text: 'Tip  Try ' },
  { text: '/projects', bold: true },
  { text: ' to browse projects' },
];

export function Dashboard({ goTo }: DashboardProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const { user } = useAuthStore();
  const { selectedProject, fetchProjects } = useProjectStore();

  const showSuggestions = inputValue.startsWith('/');
  const filtered = showSuggestions
    ? commands.filter((c) => c.cmd.startsWith(inputValue))
    : [];

  const navigateTo = (route: Route) => {
    if (route === 'projects') fetchProjects();
    setInputValue('');
    goTo(route);
  };

  useKeyboard({
    onUp: () => {
      if (filtered.length > 0) {
        setSuggestionIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
      }
    },
    onDown: () => {
      if (filtered.length > 0) {
        setSuggestionIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
      }
    },
    onEnter: () => {
      if (filtered.length > 0) {
        const selected = filtered[suggestionIndex];
        if (selected) {
          setInputValue(selected.cmd);
          if (selected.route === 'projects') fetchProjects();
          goTo(selected.route);
        }
      }
    },
    onEscape: () => {
      if (inputValue.startsWith('/')) {
        setInputValue('');
        setSuggestionIndex(0);
      } else {
        process.exit(0);
      }
    },
    isActive: true,
  });

  return (
    <Box flexDirection="column" alignItems="center" gap={0}>
      <CommandInput>
        <Box>
          <TextInput
            value={inputValue}
            onChange={(v) => { setInputValue(v); setSuggestionIndex(0); }}
            placeholder="Type the command '/'"
            onSubmit={(value) => {
              const match = commands.find((c) => c.cmd === value);
              if (match) navigateTo(match.route);
            }}
          />
        </Box>
        {showSuggestions && filtered.length > 0 && (
          <Box flexDirection="column">
            <Text color={colors.textDim}>{'─'.repeat(48)}</Text>
            {filtered.slice(0, 8).map((c, i) => {
              const isSel = i === suggestionIndex;
              return (
                <Box key={c.cmd} gap={2}>
                  <Box width={1}>
                    <Text color={colors.accent}>{isSel ? '>' : ' '}</Text>
                  </Box>
                  <Text color={isSel ? colors.accent : colors.textSecondary} bold={isSel}>{c.cmd}</Text>
                  <Text color={colors.textDim}>{c.desc}</Text>
                </Box>
              );
            })}
            <Text color={colors.textDim}>{'─'.repeat(48)}</Text>
            <Text color={colors.textDim}>
              {filtered.length > 8 ? `8 of ${filtered.length} commands` : `${filtered.length} command${filtered.length !== 1 ? 's' : ''}`}
            </Text>
          </Box>
        )}
        {showSuggestions && filtered.length === 0 && inputValue.length > 1 && (
          <Box marginTop={1}>
            <Text color={colors.textDim}>no matching commands</Text>
          </Box>
        )}
        {!showSuggestions && (
          <Box minHeight={1}>
            <Text color={colors.textSecondary}>{selectedProject?.projectName ?? 'curo'}</Text>
            <Text color={colors.textDim}>  ·  </Text>
            <Text color={colors.textDim}>{user?.email ?? 'not signed in'}</Text>
          </Box>
        )}
      </CommandInput>
      <Box height={1} />
      <KeyHints hints={hints} />
      <Box height={1} />
      <TipLine segments={tipSegments} />
    </Box>
  );
}
