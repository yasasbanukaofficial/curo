import React from 'react';
import { Box, Text } from 'ink';
import { useScrollback } from '../store/scrollback.js';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import { check, cross, caret, section } from '../theme/icons.js';

const iconMap: Record<string, { icon: string; color: string }> = {
  success: { icon: check, color: colors.success },
  error: { icon: cross, color: colors.error },
  info: { icon: caret, color: colors.accent },
  step: { icon: section, color: colors.textSecondary },
};

export function ScrollbackLog() {
  const { entries } = useScrollback();
  if (entries.length === 0) return null;

  return (
    <Box flexDirection="column" width="100%" paddingX={2}>
      {entries.map((entry) => {
        const cfg = iconMap[entry.type] ?? iconMap.info;
        return (
          <Box key={entry.id} gap={1}>
            <Text color={cfg.color}>{cfg.icon}</Text>
            <Text color={colors.textSecondary}>{entry.message}</Text>
            {entry.detail && <Text color={colors.textDim}>{entry.detail}</Text>}
          </Box>
        );
      })}
    </Box>
  );
}
