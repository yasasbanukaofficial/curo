import React, { type ReactNode } from 'react';
import { Box } from 'ink';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { Logo } from '../components/Logo.js';
import { ScrollbackLog } from '../components/ScrollbackLog.js';
import { StatusBar } from '../components/StatusBar.js';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { rows, columns } = useTerminalSize();

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Box flexGrow={1} flexShrink={1} minHeight={0} />
      <Box flexDirection="column" alignItems="center" flexShrink={0} paddingX={4}>
        <Logo />
        <Box height={1} />
        <ScrollbackLog />
        {children}
      </Box>
      <Box flexGrow={1} flexShrink={1} minHeight={0} />
      <Box height={1}>
        <StatusBar />
      </Box>
      <Box height={1} />
    </Box>
  );
}
