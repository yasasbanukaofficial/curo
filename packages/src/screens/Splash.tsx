import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { useAuthStore } from '../store/auth.js';
import { useScrollback } from '../store/scrollback.js';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import type { Route } from '../types/index.js';

interface SplashProps {
  goTo: (route: Route) => void;
}

export function Splash({ goTo }: SplashProps) {
  const { checkAuth } = useAuthStore();
  const { push } = useScrollback();
  const spinner = useSpinnerFrame();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasSession = await checkAuth();
      if (hasSession) {
        push('success', 'Session restored');
        goTo('dashboard');
      } else {
        push('info', 'No active session — sign in to continue');
        goTo('login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box gap={1}>
      <Text color={colors.accent}>{spinner}</Text>
      <Text color={colors.textSecondary}>checking session...</Text>
    </Box>
  );
}
