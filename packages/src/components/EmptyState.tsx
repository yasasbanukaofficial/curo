import React from 'react';
import { Box, Text } from 'ink';

interface EmptyStateProps {
  message?: string;
  hint?: string;
}

export function EmptyState({ message = 'Nothing here', hint }: EmptyStateProps) {
  return (
    <Box flexDirection="column" paddingY={1} paddingLeft={2} gap={0}>
      <Text color="gray" dimColor>─ {message}</Text>
      {hint && <Text color="gray" dimColor>  {hint}</Text>}
    </Box>
  );
}
