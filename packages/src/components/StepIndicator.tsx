import React from 'react';
import { Box, Text } from 'ink';
import { useSpinnerFrame } from '../hooks/useSpinnerFrame.js';
import * as colors from '../theme/colors.js';
import { check, cross, unselected } from '../theme/icons.js';

type StepStatus = 'pending' | 'loading' | 'done' | 'error';

interface StepIndicatorProps {
  status: StepStatus;
  label: string;
  detail?: string;
}

export function StepIndicator({ status, label, detail }: StepIndicatorProps) {
  const spinner = useSpinnerFrame();

  const icon = () => {
    switch (status) {
      case 'done':    return <Text color={colors.success}>{check}</Text>;
      case 'error':   return <Text color={colors.error}>{cross}</Text>;
      case 'loading': return <Text color={colors.accent}>{spinner}</Text>;
      default:        return <Text color={colors.textDim}>{unselected}</Text>;
    }
  };

  return (
    <Box gap={1}>
      <Box width={1}>{icon()}</Box>
      <Text
        color={status === 'done' || status === 'loading' ? colors.textSecondary : colors.textDim}
        bold={status === 'loading'}
      >
        {label}
      </Text>
      {detail && <Text color={colors.textDim}>{detail}</Text>}
    </Box>
  );
}
