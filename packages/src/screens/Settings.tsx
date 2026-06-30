import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { useAuthStore } from '../store/auth.js';
import { useScrollback } from '../store/scrollback.js';
import { KeyHints } from '../components/KeyHints.js';
import { clearAll } from '../services/token.js';
import { APP_VERSION } from '../services/env.js';
import * as colors from '../theme/colors.js';
import { caret } from '../theme/icons.js';
import type { Route } from '../types/index.js';

interface SettingsProps {
  goTo: (route: Route) => void;
}

const hints = [
  { key: '↑↓', label: 'navigate' },
  { key: 'enter', label: 'select' },
  { key: 'esc', label: 'back' },
];

const confirmHints = [
  { key: 'enter', label: 'confirm' },
  { key: 'esc', label: 'cancel' },
];

const menuItems = [
  { value: 'clear' as const, label: 'clear local data', hint: 'remove credentials and token cache', danger: true },
];

export function Settings({ goTo }: SettingsProps) {
  const { columns } = useTerminalSize();
  const boxWidth = Math.min(72, Math.max(40, columns - 8));
  const { user, isAuthenticated } = useAuthStore();
  const { push } = useScrollback();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useKeyboard({
    onUp: () => { setConfirmClear(false); setSelectedIndex((i) => Math.max(0, i - 1)); },
    onDown: () => { setConfirmClear(false); setSelectedIndex((i) => Math.min(menuItems.length - 1, i + 1)); },
    onEscape: () => { if (confirmClear) { setConfirmClear(false); setConfirmText(''); } else goTo('dashboard'); },
    onEnter: () => {
      if (menuItems[selectedIndex]?.value === 'clear') {
        if (!confirmClear) { setConfirmClear(true); return; }
        if (confirmText.toLowerCase() !== 'yes') return;
        clearAll();
        push('info', 'Local data cleared');
        goTo('login');
      }
    },
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
        <Box gap={1}>
          <Box width={8}><Text color={colors.textDim}>name</Text></Box>
          <Text color={colors.textSecondary}>{user?.name ?? '—'}</Text>
        </Box>
        <Box gap={1}>
          <Box width={8}><Text color={colors.textDim}>email</Text></Box>
          <Text color={colors.textSecondary}>{user?.email ?? '—'}</Text>
        </Box>
        <Box gap={1}>
          <Box width={8}><Text color={colors.textDim}>version</Text></Box>
          <Text color={colors.textSecondary}>v{APP_VERSION}</Text>
        </Box>
        <Box gap={1}>
          <Box width={8}><Text color={colors.textDim}>auth</Text></Box>
          <Text color={isAuthenticated ? colors.accent : colors.textDim}>{isAuthenticated ? 'authenticated' : 'not authenticated'}</Text>
        </Box>

        <Text color={colors.textDim}>danger zone</Text>

        <Box flexDirection="column" gap={0}>
          {menuItems.map((item, index) => {
            const isSel = index === selectedIndex;
            return (
              <Box key={item.value} gap={1}>
                <Text color={isSel ? colors.accent : colors.textDim}>{isSel ? caret : ' '}</Text>
                <Text color={isSel ? colors.error : colors.textSecondary} bold={isSel}>{item.label}</Text>
                <Text color={colors.textDim}>{item.hint}</Text>
              </Box>
            );
          })}
        </Box>

        {confirmClear && (
          <Box flexDirection="column" gap={0}>
            <Text color={colors.error}>type "yes" to confirm clearing all local data</Text>
            <TextInput
              value={confirmText}
              onChange={setConfirmText}
              placeholder=""
            />
          </Box>
        )}
      </Box>

      <KeyHints hints={confirmClear ? confirmHints : hints} />
    </Box>
  );
}
