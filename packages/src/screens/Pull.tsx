import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useProjectStore } from '../store/project.js';
import { useScrollback } from '../store/scrollback.js';
import { StepIndicator } from '../components/StepIndicator.js';
import * as secretApi from '../api/secret.js';
import type { Route } from '../types/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface PullProps {
  goTo: (route: Route) => void;
}

interface StepState {
  label: string;
  status: 'pending' | 'loading' | 'done' | 'error';
}

const steps: StepState[] = [
  { label: 'Authenticate session', status: 'pending' },
  { label: 'Fetch secrets', status: 'pending' },
  { label: 'Prepare values', status: 'pending' },
  { label: 'Write .env file', status: 'pending' },
];

export function Pull({ goTo }: PullProps) {
  const { selectedProject } = useProjectStore();
  const { push } = useScrollback();
  const [stepStates, setStepStates] = useState<StepState[]>(steps);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [envPath, setEnvPath] = useState('');
  const [count, setCount] = useState(0);

  const setStep = (i: number, status: StepState['status']) =>
    setStepStates((prev) => prev.map((s, idx) => idx === i ? { ...s, status } : s));

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;
      try {
        setStep(0, 'loading');
        await new Promise((r) => setTimeout(r, 300));
        setStep(0, 'done');

        setStep(1, 'loading');
        const secrets = await secretApi.getSecrets(selectedProject._id);
        setStep(1, 'done');

        setStep(2, 'loading');
        await new Promise((r) => setTimeout(r, 200));
        setStep(2, 'done');

        setStep(3, 'loading');
        const content = secrets.map((s) => `${s.secName}=${s.secKey}`).join('\n');
        const fp = path.join(process.cwd(), '.env');
        fs.writeFileSync(fp, content, 'utf-8');
        setEnvPath(fp);
        setStep(3, 'done');

        setCount(secrets.length);
        setCompleted(true);
        push('success', `.env saved with ${secrets.length} secret${secrets.length !== 1 ? 's' : ''}`, fp);
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'failed to pull secrets';
        setFailed(true);
        setStepStates((prev) => prev.map((s) => s.status === 'loading' ? { ...s, status: 'error' } : s));
        push('error', msg);
      }
    })();
  }, []);

  useKeyboard({
    onEnter: () => (completed || failed) && goTo('project'),
    onEscape: () => goTo('project'),
  });

  return (
    <Box flexDirection="column" alignItems="center" gap={1}>
      {stepStates.map((s, i) => (
        <StepIndicator key={i} status={s.status} label={s.label} />
      ))}
      {completed && (
        <Text>{count} secret{count !== 1 ? 's' : ''} written → {envPath}</Text>
      )}
      {(completed || failed) && (
        <Text>press enter to go back</Text>
      )}
    </Box>
  );
}
