import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import { useAuthStore } from '../store/auth.js';
import type { Route } from '../types/index.js';

interface SplashProps {
  goTo: (route: Route) => void;
}

export function Splash({ goTo }: SplashProps) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasSession = await checkAuth();
      if (hasSession) {
        goTo('dashboard');
      } else {
        goTo('login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* ASCII wordmark */}
      <Gradient name="mind">
        <BigText text="CURO" font="chrome" align="left" letterSpacing={1} />
      </Gradient>

      {/* Tagline */}
      <Box marginLeft={1} marginTop={0} gap={2}>
        <Text color="gray">Secure Environment Management</Text>
        <Text color="gray" dimColor>v1.0.0</Text>
      </Box>

      {/* Separator */}
      <Box marginTop={1} marginLeft={1}>
        <Text color="gray">{'─'.repeat(48)}</Text>
      </Box>

      {/* Loading */}
      <Box marginTop={1} marginLeft={2} gap={2}>
        <Text color="cyan"><Spinner type="dots" /></Text>
        <Text color="gray" dimColor>Initializing session…</Text>
      </Box>
    </Box>
  );
}
