import React from 'react';
import { Box } from 'ink';
import { NavigationProvider } from './Navigation.js';
import { AuthProvider } from '../store/auth.js';
import { ProjectProvider } from '../store/project.js';
import { UIProvider } from '../store/ui.js';
import { Router } from './Router.js';

export function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ProjectProvider>
          <UIProvider>
            <Box flexDirection="column" width="100%" minHeight="100%">
              <Router />
            </Box>
          </UIProvider>
        </ProjectProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
