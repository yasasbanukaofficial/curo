import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useAuthStore } from '../store/auth.js';
import { getWorkspace } from '../services/token.js';
import type { Route } from '../types/index.js';

interface DashboardProps {
  goTo: (route: Route) => void;
}

const menuItems = [
  { value: 'projects', label: 'projects',  hint: 'browse and manage projects',           icon: '◆' },
  { value: 'settings', label: 'settings',  hint: 'credentials, config, and version info', icon: '◈' },
  { value: 'logout',   label: 'logout',    hint: 'sign out and clear local session',      icon: '◇' },
] as const;

type ItemValue = typeof menuItems[number]['value'];

export function Dashboard({ goTo }: DashboardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user } = useAuthStore();

  useKeyboard({
    onUp: () => setSelectedIndex((i) => (i > 0 ? i - 1 : menuItems.length - 1)),
    onDown: () => setSelectedIndex((i) => (i < menuItems.length - 1 ? i + 1 : 0)),
    onEscape: () => process.exit(0),
    onEnter: () => goTo(menuItems[selectedIndex]!.value as ItemValue),
  });

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Intro line — mirrors: intro(color.dim("what would you like to do?")) */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>what would you like to do?</Text>
      </Box>

      {/* Select list — mirrors clack select */}
      <Box flexDirection="column" gap={0}>
        {menuItems.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box key={item.value} gap={2} paddingY={0}>
              {/* Selector */}
              <Text color={isSelected ? 'cyan' : 'gray'}>
                {isSelected ? '›' : ' '}
              </Text>
              {/* Label */}
              <Text color={isSelected ? 'cyan' : 'gray'} bold={isSelected}>
                {item.label}
              </Text>
              {/* Hint */}
              <Text color="gray" dimColor>{item.hint}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Outro line */}
      <Box gap={1} marginTop={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>
          run <Text color="cyan">curo --help</Text> anytime to see all commands
        </Text>
      </Box>

    </Box>
  );
}
