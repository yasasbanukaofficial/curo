import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface LoadingProps {
  label?: string;
  color?: string;
}

export function Loading({ label = 'Loading', color = 'cyan' }: LoadingProps) {
  return (
    <Box gap={1}>
      <Text color={color}>
        <Spinner type="dots" />
      </Text>
      <Text color="white" dimColor>{label}</Text>
    </Box>
  );
}
