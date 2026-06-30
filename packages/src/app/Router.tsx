import React from 'react';
import { useNavigation } from './Navigation.js';
import { Splash } from '../screens/Splash.js';
import { Login } from '../screens/Login.js';
import { Dashboard } from '../screens/Dashboard.js';
import { Projects } from '../screens/Projects.js';
import { ProjectScreen } from '../screens/Project.js';
import { Settings } from '../screens/Settings.js';
import { Logout } from '../screens/Logout.js';
import { Shell } from './Shell.js';

export function Router() {
  const { currentRoute, navigate } = useNavigation();

  const renderScreen = () => {
    switch (currentRoute) {
      case 'splash':    return <Splash goTo={navigate} />;
      case 'login':     return <Login goTo={navigate} />;
      case 'dashboard': return <Dashboard goTo={navigate} />;
      case 'projects':  return <Projects goTo={navigate} />;
      case 'project':   return <ProjectScreen goTo={navigate} />;
      case 'settings':  return <Settings goTo={navigate} />;
      case 'logout':    return <Logout goTo={navigate} />;
    }
  };

  return (
    <Shell>
      {renderScreen()}
    </Shell>
  );
}
