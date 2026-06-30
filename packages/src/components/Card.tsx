import React, { type ReactNode } from 'react';
import { Box } from 'ink';

interface CardProps {
  children: ReactNode;
  focused?: boolean;
  padding?: number;
}

export function Card({ children, focused = false, padding = 1 }: CardProps) {
  return (
    <Box
      borderStyle="single"
      borderColor={focused ? 'cyan' : 'gray'}
      padding={padding}
      flexDirection="column"
    >
      {children}
    </Box>
  );
}
