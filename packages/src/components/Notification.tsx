import React from 'react';
import { Box, Text } from 'ink';
import { useUiStore } from '../store/ui.js';

const cfg: Record<string, { icon: string; color: string }> = {
  success: { icon: '✔', color: 'green' },
  error:   { icon: '✖', color: 'red' },
  info:    { icon: '●', color: 'cyan' },
  warning: { icon: '⚠', color: 'yellow' },
};

export function Notifications() {
  const { notifications } = useUiStore();
  if (notifications.length === 0) return null;

  return (
    <Box flexDirection="column" marginBottom={1} gap={0}>
      {notifications.map((n) => {
        const { icon, color } = cfg[n.type] ?? cfg.info;
        return (
          <Box key={n.id} gap={1} borderStyle="single" borderColor={color} paddingX={1}>
            <Text color={color} bold>{icon}</Text>
            <Text color="white" dimColor>{n.message}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
