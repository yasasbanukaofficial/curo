import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useUiStore } from '../store/ui.js';
import { clearAll, getToken } from '../services/token.js';
import { API_URL, APP_VERSION } from '../services/env.js';
import type { Route } from '../types/index.js';

interface SettingsProps {
  goTo: (route: Route) => void;
}

export function Settings({ goTo }: SettingsProps) {
  const { addNotification } = useUiStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);

  const menuItems = [
    { value: 'clear', label: 'clear local data', hint: 'remove credentials and token cache', danger: true },
  ] as const;

  useKeyboard({
    onUp: () => { setConfirmClear(false); setSelectedIndex((i) => Math.max(0, i - 1)); },
    onDown: () => { setConfirmClear(false); setSelectedIndex((i) => Math.min(menuItems.length - 1, i + 1)); },
    onEscape: () => { if (confirmClear) setConfirmClear(false); else goTo('dashboard'); },
    onEnter: () => {
      if (menuItems[selectedIndex]?.value === 'clear') {
        if (!confirmClear) { setConfirmClear(true); return; }
        clearAll();
        addNotification('info', 'local data cleared');
        goTo('login');
      }
    },
  });

  const authed = !!getToken();

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Config info */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>configuration</Text>
      </Box>

      <Box flexDirection="column" gap={0} paddingLeft={2}>
        <Box gap={1}>
          <Box width={16}><Text color="gray" dimColor>api url</Text></Box>
          <Text color="white">{API_URL}</Text>
        </Box>
        <Box gap={1}>
          <Box width={16}><Text color="gray" dimColor>version</Text></Box>
          <Text color="white">v{APP_VERSION}</Text>
        </Box>
        <Box gap={1}>
          <Box width={16}><Text color="gray" dimColor>auth</Text></Box>
          <Text color={authed ? 'green' : 'red'}>{authed ? '● authenticated' : '○ not authenticated'}</Text>
        </Box>
      </Box>

      {/* Danger zone */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="red" dimColor>danger zone</Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        {menuItems.map((item, index) => {
          const isSel = index === selectedIndex;
          return (
            <Box key={item.value} gap={2}>
              <Text color={isSel ? 'cyan' : 'gray'}>{isSel ? '›' : ' '}</Text>
              <Text color={isSel ? 'red' : 'gray'} bold={isSel}>{item.label}</Text>
              <Text color="gray" dimColor>{item.hint}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Confirm banner */}
      {confirmClear && (
        <Box gap={1} borderStyle="single" borderColor="red" paddingX={1}>
          <Text color="red" bold>⚠</Text>
          <Text color="red">this will sign you out. press </Text>
          <Text color="white" bold>enter</Text>
          <Text color="red"> to confirm or </Text>
          <Text color="white" bold>esc</Text>
          <Text color="red"> to cancel</Text>
        </Box>
      )}

      {/* Outro */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>
          {confirmClear ? 'enter confirm  · esc cancel' : '↑↓ navigate  · enter select  · esc back'}
        </Text>
      </Box>

    </Box>
  );
}
