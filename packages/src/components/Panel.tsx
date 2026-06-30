import React, { type ReactNode } from 'react';
import { Box } from 'ink';

interface PanelProps {
  children: ReactNode;
  borderColor?: string;
  padding?: number;
}

export function Panel({ children, borderColor = 'gray', padding = 1 }: PanelProps) {
  return (
    <Box borderStyle="single" borderColor={borderColor} padding={padding} flexDirection="column" width="100%">
      {children}
    </Box>
  );
}
