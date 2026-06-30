import React from 'react';
import { Box, Text } from 'ink';
import { useAuthStore } from '../store/auth.js';
import { useProjectStore } from '../store/project.js';
import { useNavigation } from '../app/Navigation.js';
import { APP_VERSION } from '../services/env.js';

export function Header() {
  const { selectedProject } = useProjectStore();
  const { currentRoute } = useNavigation();
  const { user } = useAuthStore();

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Banner box — mirrors: boxen(..., { borderStyle: 'round', borderColor: 'cyan' }) */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Left: brand + breadcrumb */}
        <Box gap={1} alignItems="center">
          <Text color="cyan" bold>CURO</Text>
          <Text color="gray">·</Text>
          <Text color="gray" dimColor>secrets manager</Text>
          {selectedProject && (
            <>
              <Text color="gray">›</Text>
              <Text color="white">{selectedProject.projectName}</Text>
            </>
          )}
        </Box>

        {/* Right: version + status + user */}
        <Box gap={1} alignItems="center">
          <Text color="gray" dimColor>v{APP_VERSION}</Text>
          <Text color="gray" dimColor>·</Text>
          <Text color="green">●</Text>
          {user && <Text color="white" dimColor>{user.email}</Text>}
        </Box>
      </Box>
    </Box>
  );
}
