import React from 'react';
import { Box, Text } from 'ink';
import * as colors from '../theme/colors.js';

interface KeyHint {
  key: string;
  label: string;
}

interface KeyHintsProps {
  hints: KeyHint[];
}

export function KeyHints({ hints }: KeyHintsProps) {
  if (hints.length === 0) return null;

  return (
    <Box gap={0} justifyContent="center">
      {hints.map((h, i) => (
        <Box key={h.key} gap={0}>
          {i > 0 && <Text color={colors.textDim}>    </Text>}
          <Text bold color={colors.textPrimary}>{h.key}</Text>
          <Text color={colors.textDim}> </Text>
          <Text color={colors.textDim}>{h.label}</Text>
        </Box>
      ))}
    </Box>
  );
}
