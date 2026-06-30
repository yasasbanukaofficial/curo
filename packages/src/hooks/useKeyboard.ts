import { useInput } from 'ink';
import { useCallback } from 'react';

interface KeyboardBindings {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSlash?: () => void;
  onBackspace?: () => void;
  isActive?: boolean;
}

export function useKeyboard(bindings: KeyboardBindings) {
  useInput(
    (input, key) => {
      if (key.upArrow && bindings.onUp) { bindings.onUp(); return true; }
      if (key.downArrow && bindings.onDown) { bindings.onDown(); return true; }
      if (key.leftArrow && bindings.onLeft) { bindings.onLeft(); return true; }
      if (key.rightArrow && bindings.onRight) { bindings.onRight(); return true; }
      if (key.return && bindings.onEnter) { bindings.onEnter(); return true; }
      if (key.escape && bindings.onEscape) { bindings.onEscape(); return true; }
      if (key.backspace && bindings.onBackspace) { bindings.onBackspace(); return true; }
      if (input === '/' && bindings.onSlash) { bindings.onSlash(); return true; }
    },
    { isActive: bindings.isActive ?? true },
  );
}
