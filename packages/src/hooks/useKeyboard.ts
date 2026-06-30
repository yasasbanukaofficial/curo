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
      if (key.upArrow && bindings.onUp) bindings.onUp();
      else if (key.downArrow && bindings.onDown) bindings.onDown();
      else if (key.leftArrow && bindings.onLeft) bindings.onLeft();
      else if (key.rightArrow && bindings.onRight) bindings.onRight();
      else if (key.return && bindings.onEnter) bindings.onEnter();
      else if (key.escape && bindings.onEscape) bindings.onEscape();
      else if (key.backspace && bindings.onBackspace) bindings.onBackspace();
      else if (input === '/' && bindings.onSlash) bindings.onSlash();
    },
    { isActive: bindings.isActive ?? true },
  );
}
