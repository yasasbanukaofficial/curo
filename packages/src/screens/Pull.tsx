import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useProjectStore } from '../store/project.js';
import { useUiStore } from '../store/ui.js';
import * as secretApi from '../api/secret.js';
import type { Route } from '../types/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface PullProps {
  goTo: (route: Route) => void;
}

interface Step {
  label: string;
  hint: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  detail?: string;
}

const STEPS: Omit<Step, 'status'>[] = [
  { label: 'authenticate', hint: 'verifying session token' },
  { label: 'download',     hint: 'fetching encrypted secrets' },
  { label: 'decrypt',      hint: 'decrypting values' },
  { label: 'write',        hint: 'writing .env to disk' },
];

export function Pull({ goTo }: PullProps) {
  const { selectedProject } = useProjectStore();
  const { addNotification } = useUiStore();
  const [steps, setSteps] = useState<Step[]>(STEPS.map((s) => ({ ...s, status: 'pending' })));
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [envPath, setEnvPath] = useState('');
  const [count, setCount] = useState(0);

  const set = (i: number, status: Step['status'], detail?: string) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, status, detail } : s)));

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;
      try {
        set(0, 'loading');
        await new Promise((r) => setTimeout(r, 300));
        set(0, 'done');

        set(1, 'loading');
        const secrets = await secretApi.getSecrets(selectedProject._id);
        set(1, 'done', `${secrets.length} secret${secrets.length !== 1 ? 's' : ''}`);

        set(2, 'loading');
        await new Promise((r) => setTimeout(r, 200));
        set(2, 'done');

        set(3, 'loading');
        const content = secrets.map((s) => `${s.secName}=${s.secKey}`).join('\n');
        const fp = path.join(process.cwd(), '.env');
        fs.writeFileSync(fp, content, 'utf-8');
        setEnvPath(fp);
        set(3, 'done', fp);

        setCount(secrets.length);
        setCompleted(true);
        addNotification('success', `.env saved · ${secrets.length} secret${secrets.length !== 1 ? 's' : ''}`);
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? 'failed to pull secrets';
        setErrorMsg(msg);
        setFailed(true);
        setSteps((prev) => prev.map((s) => s.status === 'loading' ? { ...s, status: 'error' } : s));
        addNotification('error', msg);
      }
    })();
  }, []);

  useKeyboard({
    onEnter: () => (completed || failed) && goTo('project'),
    onEscape: () => goTo('project'),
  });

  const icon = (s: Step['status']) => {
    if (s === 'pending') return <Text color="gray" dimColor>○</Text>;
    if (s === 'loading') return <Text color="cyan">◌</Text>;
    if (s === 'done')    return <Text color="green">✔</Text>;
    return                      <Text color="red">✖</Text>;
  };

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Intro */}
      <Box gap={1}>
        <Text color="gray" dimColor>──</Text>
        <Text color="gray" dimColor>pulling secrets from </Text>
        <Text color="cyan">{selectedProject?.projectName}</Text>
      </Box>

      {/* Steps — mirrors: s.start() / s.stop() */}
      <Box flexDirection="column" gap={0}>
        {steps.map((step) => (
          <Box key={step.label} gap={2} paddingLeft={1}>
            <Box width={2}>{icon(step.status)}</Box>
            <Text
              color={step.status === 'done' ? 'white' : step.status === 'loading' ? 'cyan' : step.status === 'error' ? 'red' : 'gray'}
              dimColor={step.status === 'pending'}
              bold={step.status === 'loading'}
            >
              {step.label}{step.status === 'loading' ? '…' : ''}
            </Text>
            {step.status === 'done' && step.detail && (
              <Text color="gray" dimColor>{step.detail}</Text>
            )}
            {(step.status === 'pending' || step.status === 'loading') && (
              <Text color="gray" dimColor>{step.hint}</Text>
            )}
          </Box>
        ))}
      </Box>

      {/* Result */}
      {completed && (
        <Box flexDirection="column" gap={0}>
          <Box gap={1}>
            <Text color="gray" dimColor>──</Text>
            <Text color="green">✔</Text>
            <Text color="white">{count} secret{count !== 1 ? 's' : ''} written</Text>
            <Text color="gray" dimColor>→ {envPath}</Text>
          </Box>
          <Box paddingLeft={2}>
            <Text color="gray" dimColor>press enter to go back</Text>
          </Box>
        </Box>
      )}

      {/* Error */}
      {failed && (
        <Box flexDirection="column" gap={0}>
          <Box gap={1} borderStyle="single" borderColor="red" paddingX={1}>
            <Text color="red" bold>✖</Text>
            <Text color="red">{errorMsg}</Text>
          </Box>
          <Box paddingLeft={1}>
            <Text color="gray" dimColor>press enter or esc to go back</Text>
          </Box>
        </Box>
      )}

    </Box>
  );
}
