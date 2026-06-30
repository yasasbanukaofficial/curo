import React from 'react';
import { Box, Text } from 'ink';
import * as colors from '../theme/colors.js';
import { bullet } from '../theme/icons.js';

interface TipSegment {
  text: string;
  bold?: boolean;
}

interface TipLineProps {
  segments: TipSegment[];
}

export function TipLine({ segments }: TipLineProps) {
  return (
    <Box gap={0} justifyContent="center">
      <Text color={colors.tipAccent}>{bullet}</Text>
      <Text> </Text>
      {segments.map((seg, i) => (
        <Text key={i} color={colors.textSecondary} bold={seg.bold}>{seg.text}</Text>
      ))}
    </Box>
  );
}
