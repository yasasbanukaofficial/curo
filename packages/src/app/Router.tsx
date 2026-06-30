import React from 'react';
import { Box } from 'ink';
import { useNavigation } from './Navigation.js';
import { Splash } from '../screens/Splash.js';
import { Login } from '../screens/Login.js';
import { Dashboard } from '../screens/Dashboard.js';
import { Projects } from '../screens/Projects.js';
import { ProjectScreen } from '../screens/Project.js';
import { Pull } from '../screens/Pull.js';
import { Settings } from '../screens/Settings.js';
import { Logout } from '../screens/Logout.js';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { Notifications } from '../components/Notification.js';
import type { Route } from '../types/index.js';

const screensWithFrame: Route[] = ['dashboard', 'projects', 'project', 'pull', 'settings'];

const routeHints: Record<Route, string> = {
  splash: '',
  login: '↑↓ field  ·  Enter submit  ·  Ctrl+C quit',
  dashboard: '↑↓ navigate  ·  Enter select  ·  Esc quit',
  projects: '↑↓ navigate  ·  Enter open  ·  / search  ·  Esc back',
  project: 'Enter actions  ·  Esc back',
  pull: 'Enter / Esc to go back when done',
  settings: '↑↓ navigate  ·  Enter select  ·  Esc back',
  logout: '',
};

export function Router() {
  const { currentRoute, navigate } = useNavigation();
  const hasFrame = screensWithFrame.includes(currentRoute);
  const hint = routeHints[currentRoute];

  const renderScreen = () => {
    switch (currentRoute) {
      case 'splash':    return <Splash goTo={navigate} />;
      case 'login':     return <Login goTo={navigate} />;
      case 'dashboard': return <Dashboard goTo={navigate} />;
      case 'projects':  return <Projects goTo={navigate} />;
      case 'project':   return <ProjectScreen goTo={navigate} />;
      case 'pull':      return <Pull goTo={navigate} />;
      case 'settings':  return <Settings goTo={navigate} />;
      case 'logout':    return <Logout goTo={navigate} />;
    }
  };

  return (
    <Box flexDirection="column" width="100%" paddingX={1}>
      <Notifications />
      {hasFrame && <Header />}
      {renderScreen()}
      {hasFrame && <Footer hint={hint} />}
    </Box>
  );
}
