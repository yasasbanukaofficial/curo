import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { useAuthStore } from '../store/auth.js';
import { useUiStore } from '../store/ui.js';
import type { Route } from '../types/index.js';

interface LogoutProps {
  goTo: (route: Route) => void;
}

export function Logout({ goTo }: LogoutProps) {
  const { logout } = useAuthStore();
  const { addNotification } = useUiStore();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      setIsDone(true);
      addNotification('info', 'Session ended. See you next time!');
      goTo('login');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>
      <Text color="gray">{'─'.repeat(60)}</Text>
      <Box gap={2} paddingLeft={1}>
        {!isDone ? (
          <>
            <Text color="cyan"><Spinner type="dots" /></Text>
            <Text color="white">Signing out…</Text>
          </>
        ) : (
          <>
            <Text color="green">✔</Text>
            <Text color="white">Signed out successfully</Text>
          </>
        )}
      </Box>
      <Box paddingLeft={1}>
        <Text color="gray" dimColor>Clearing local session data</Text>
      </Box>
      <Text color="gray">{'─'.repeat(60)}</Text>
    </Box>
  );
}
