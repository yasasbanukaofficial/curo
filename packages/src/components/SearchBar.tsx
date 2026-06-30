import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search…' }: SearchBarProps) {
  return (
    <Box>
      <Text color="cyan">Search </Text>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Box>
  );
}
