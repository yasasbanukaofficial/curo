import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { useAuthStore } from '../store/auth.js';
import { useUiStore } from '../store/ui.js';
import type { Route } from '../types/index.js';

interface LoginProps {
  goTo: (route: Route) => void;
}

export function Login({ goTo }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusField, setFocusField] = useState<'email' | 'password'>('email');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const { login } = useAuthStore();
  const { addNotification } = useUiStore();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'invalid email';
    if (!password) e.password = 'required';
    else if (password.length < 6) e.password = 'min 6 chars';
    return e;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.email) setFocusField('email');
      else setFocusField('password');
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      addNotification('success', `signed in as ${email.trim()}`);
      goTo('dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'authentication failed';
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  useKeyboard({
    onUp: () => !isSubmitting && setFocusField('email'),
    onDown: () => !isSubmitting && setFocusField('password'),
    onEnter: handleSubmit,
  });

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>

      {/* Branding */}
      <Box flexDirection="column" gap={0}>
        <Box gap={1}>
          <Text color="cyan" bold>CURO</Text>
          <Text color="gray" dimColor>· secrets manager</Text>
        </Box>
        <Text color="gray" dimColor>sign in to continue</Text>
      </Box>

      {/* Form — round bordered box */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={errors.form ? 'red' : 'gray'}
        paddingX={2}
        paddingY={1}
        gap={1}
        width={52}
      >

        {/* Form-level error */}
        {errors.form && (
          <Box gap={1}>
            <Text color="red" bold>✖</Text>
            <Text color="red">{errors.form}</Text>
          </Box>
        )}

        {/* Email */}
        <Box flexDirection="column" gap={0}>
          <Box gap={1}>
            <Text color={focusField === 'email' ? 'cyan' : 'gray'}>
              {focusField === 'email' ? '›' : ' '}
            </Text>
            <Text color={errors.email ? 'red' : focusField === 'email' ? 'cyan' : 'gray'}>
              email
            </Text>
            {errors.email && (
              <Text color="red" dimColor>— {errors.email}</Text>
            )}
          </Box>
          <Box paddingLeft={2}>
            <TextInput
              value={email}
              onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined, form: undefined })); }}
              placeholder="you@example.com"
              focus={focusField === 'email' && !isSubmitting}
            />
          </Box>
        </Box>

        {/* Separator */}
        <Text color="gray" dimColor>{'·'.repeat(44)}</Text>

        {/* Password */}
        <Box flexDirection="column" gap={0}>
          <Box gap={1}>
            <Text color={focusField === 'password' ? 'cyan' : 'gray'}>
              {focusField === 'password' ? '›' : ' '}
            </Text>
            <Text color={errors.password ? 'red' : focusField === 'password' ? 'cyan' : 'gray'}>
              password
            </Text>
            {errors.password && (
              <Text color="red" dimColor>— {errors.password}</Text>
            )}
          </Box>
          <Box paddingLeft={2}>
            <TextInput
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined, form: undefined })); }}
              placeholder="············"
              mask="●"
              focus={focusField === 'password' && !isSubmitting}
            />
          </Box>
        </Box>

      </Box>

      {/* Submit hint */}
      <Box gap={1}>
        {isSubmitting ? (
          <>
            <Text color="cyan">◌</Text>
            <Text color="gray" dimColor>authenticating…</Text>
          </>
        ) : (
          <Text color="gray" dimColor>
            ↑↓ switch field  ·  <Text color="white">enter</Text> to sign in  ·  ctrl+c to quit
          </Text>
        )}
      </Box>

    </Box>
  );
}
