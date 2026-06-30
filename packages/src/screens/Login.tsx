import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { useKeyboard } from "../hooks/useKeyboard.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { useAuthStore } from "../store/auth.js";
import { useScrollback } from "../store/scrollback.js";
import { KeyHints } from "../components/KeyHints.js";
import * as colors from "../theme/colors.js";
import { caret } from "../theme/icons.js";
import type { Route } from "../types/index.js";

interface LoginProps {
  goTo: (route: Route) => void;
}

const hints = [
  { key: "↑↓", label: "field" },
  { key: "enter", label: "submit" },
  { key: "ctrl+c", label: "quit" },
];

export function Login({ goTo }: LoginProps) {
  const { columns } = useTerminalSize();
  const boxWidth = Math.min(60, Math.max(40, columns - 8));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusField, setFocusField] = useState<"email" | "password">("email");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
    status?: number;
  }>({});
  const { login } = useAuthStore();
  const { push } = useScrollback();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "invalid email";
    if (!password) e.password = "required";
    else if (password.length < 6) e.password = "min 6 chars";
    return e;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.email) setFocusField("email");
      else setFocusField("password");
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      push("success", `Signed in as ${email.trim()}`);
      goTo("dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      let msg: string;
      if (status === 404) {
        msg = "User is not registered";
      } else if (status === 401) {
        msg = "The credentials you entered for this email is not valid!";
      } else {
        msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "authentication failed";
      }
      setErrors({ form: msg, status });
    } finally {
      setIsSubmitting(false);
    }
  };

  useKeyboard({
    onUp: () => !isSubmitting && setFocusField("email"),
    onDown: () => !isSubmitting && setFocusField("password"),
    onEnter: handleSubmit,
  });

  return (
    <Box flexDirection="column" alignItems="center" gap={1}>
      {errors.form && (
        <Box flexDirection="column" alignItems="center" gap={0}>
          <Text color={colors.error}>{errors.form}</Text>
          {errors.status === 404 && (
            <Text>
              try visiting{" "}
              <Text color={colors.accent}>
                {"\x1B]8;;https://curo.dev\x1B\\curo.dev\x1B]8;;\x1B\\"}
              </Text>{" "}
              and try again
            </Text>
          )}
        </Box>
      )}

      <Box
        borderStyle="round"
        borderColor={colors.border}
        paddingX={1}
        flexDirection="column"
        width={boxWidth}
      >
        <Box gap={1} alignItems="center">
          <Text color={focusField === "email" ? colors.accent : colors.textDim}>
            {caret}
          </Text>
          <Text color={errors.email ? colors.error : colors.textSecondary}>
            email
          </Text>
          {errors.email && <Text color={colors.error}>{errors.email}</Text>}
        </Box>
        <Box paddingLeft={2}>
          <TextInput
            value={email}
            onChange={(v) => {
              setEmail(v);
              setErrors((e) => ({ ...e, email: undefined, form: undefined }));
            }}
            placeholder="you@example.com"
            focus={focusField === "email" && !isSubmitting}
          />
        </Box>

        <Box gap={1} alignItems="center">
          <Text
            color={focusField === "password" ? colors.accent : colors.textDim}
          >
            {caret}
          </Text>
          <Text color={errors.password ? colors.error : colors.textSecondary}>
            password
          </Text>
          {errors.password && (
            <Text color={colors.error}>{errors.password}</Text>
          )}
        </Box>
        <Box paddingLeft={2}>
          <TextInput
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors((e) => ({
                ...e,
                password: undefined,
                form: undefined,
              }));
            }}
            placeholder="············"
            mask="●"
            focus={focusField === "password" && !isSubmitting}
          />
        </Box>

        {isSubmitting && <Text color={colors.accent}>authenticating...</Text>}
      </Box>

      <KeyHints hints={hints} />
    </Box>
  );
}
