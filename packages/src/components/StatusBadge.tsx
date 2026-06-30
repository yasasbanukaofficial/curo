import React from 'react';
import { Text } from 'ink';

interface StatusBadgeProps {
  label: string;
  color?: string;
}

export function StatusBadge({ label, color = 'cyan' }: StatusBadgeProps) {
  return (
    <Text color={color}>{label}</Text>
  );
}
