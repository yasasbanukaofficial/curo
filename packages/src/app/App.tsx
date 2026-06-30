import React from 'react';
import { Box, useInput } from 'ink';
import { NavigationProvider } from './Navigation.js';
import { AuthProvider } from '../store/auth.js';
import { ProjectProvider } from '../store/project.js';
import { UIProvider } from '../store/ui.js';
import { ScrollbackProvider } from '../store/scrollback.js';
import { Router } from './Router.js';

export function App() {
  useInput((input, key) => {
    if (key.ctrl && input === 'c') process.exit(0);
  });

  return (
    <NavigationProvider>
      <AuthProvider>
        <ProjectProvider>
          <UIProvider>
            <ScrollbackProvider>
              <Box flexDirection="column" width="100%" minHeight="100%">
                <Router />
              </Box>
            </ScrollbackProvider>
          </UIProvider>
        </ProjectProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
