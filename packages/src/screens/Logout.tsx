import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useAuthStore } from '../store/auth.js';
import { useScrollback } from '../store/scrollback.js';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import type { Route } from '../types/index.js';

interface LogoutProps {
  goTo: (route: Route) => void;
}

export function Logout({ goTo }: LogoutProps) {
  const { logout } = useAuthStore();
  const { push } = useScrollback();
  const spinner = useSpinnerFrame();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      setIsDone(true);
      push('info', 'Session ended. See you next time!');
      goTo('login');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box gap={1}>
      {!isDone ? (
        <>
          <Text color={colors.accent}>{spinner}</Text>
          <Text color={colors.textSecondary}>Signing out...</Text>
        </>
      ) : (
        <Text color={colors.success}>Signed out successfully</Text>
      )}
    </Box>
  );
}
