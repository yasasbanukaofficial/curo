import React from 'react';
import { Box, Text } from 'ink';

interface DividerProps {
  title?: string;
  width?: number;
}

export function Divider({ title, width = 60 }: DividerProps) {
  if (title) {
    const line = '─'.repeat(2);
    const endLine = '─'.repeat(Math.max(0, width - title.length - 6));
    return (
      <Box marginY={0}>
        <Text color="gray">{line} </Text>
        <Text color="white" dimColor>{title}</Text>
        <Text color="gray"> {endLine}</Text>
      </Box>
    );
  }
  return (
    <Box marginY={0}>
      <Text color="gray">{'─'.repeat(width)}</Text>
    </Box>
  );
}
