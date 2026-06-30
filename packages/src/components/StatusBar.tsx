import React from 'react';
import { Box, Text } from 'ink';
import { useAuthStore } from '../store/auth.js';
import { useProjectStore } from '../store/project.js';
import { APP_VERSION } from '../services/env.js';
import * as colors from '../theme/colors.js';

export function StatusBar() {
  const { user } = useAuthStore();
  const { selectedProject } = useProjectStore();

  const left = selectedProject
    ? `${selectedProject.projectName}:${user?.email ?? 'unknown'}`
    : 'curo';

  return (
    <Box justifyContent="space-between" width="100%" paddingX={1}>
      <Text color={colors.textDim}>{left}</Text>
      <Text color={colors.textDim}>v{APP_VERSION}</Text>
    </Box>
  );
}
