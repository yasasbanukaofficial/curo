import React from 'react';
import { Box, Text } from 'ink';
import { useAuthStore } from '../store/auth.js';
import { useProjectStore } from '../store/project.js';

interface FooterProps {
  hint?: string;
}

export function Footer({ hint }: FooterProps) {
  const { selectedProject } = useProjectStore();

  return (
    <Box marginTop={1} justifyContent="space-between" alignItems="center">
      {/* Keyboard hint on left */}
      <Text color="gray" dimColor>{hint ?? ''}</Text>

      {/* Context on right */}
      <Box gap={1}>
        {selectedProject && (
          <>
            <Text color="gray" dimColor>{selectedProject.projectName}</Text>
            <Text color="gray" dimColor>·</Text>
          </>
        )}
        <Text color="gray" dimColor>ctrl+c to quit</Text>
      </Box>
    </Box>
  );
}
