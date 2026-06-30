import React from 'react';
import { Box, useStdout } from 'ink';
import * as colors from '../theme/colors.js';

interface CommandInputProps {
  children: React.ReactNode;
}

export function CommandInput({ children }: CommandInputProps) {
  const { stdout } = useStdout();
  const cols = stdout?.columns ?? 80;
  const width = Math.min(80, Math.max(40, cols - 8));

  return (
    <Box
      borderStyle="round"
      borderColor={colors.border}
      paddingX={1}
      flexDirection="column"
      width={width}
    >
      {children}
    </Box>
  );
}
