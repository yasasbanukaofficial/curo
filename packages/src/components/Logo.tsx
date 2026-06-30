import React from 'react';
import { Box, Text } from 'ink';
import * as colors from '../theme/colors.js';

export function Logo() {
  return (
    <Box flexDirection="column" alignItems="center">
      <Text color={colors.logoFront}>██████╗██╗   ██╗██████╗  ██████╗ </Text>
      <Text color={colors.logoFront}>██╔════╝██║   ██║██╔══██╗██╔═══██╗</Text>
      <Text color={colors.logoBack}>██║     ██║   ██║██████╔╝██║   ██║</Text>
      <Text color={colors.logoBack}>██║     ██║   ██║██╔══██╗██║   ██║</Text>
      <Text color={colors.logoFront}>╚██████╗╚██████╔╝██║  ██║╚██████╔╝</Text>
      <Text color={colors.logoFront}> ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ </Text>
    </Box>
  );
}
