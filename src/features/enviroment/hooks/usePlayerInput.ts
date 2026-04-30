import { useEffect, useRef } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

const INITIAL_STATE: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
};

/**
 * Returns a stable ref containing the current directional input state.
 * Keyboards writes arrow/WASD keys directly into the ref so LocalPlayer
 * can read it inside useFrame without causing re-renders.
 *
 * Mobile input is written by MobileJoystick into the same ref.
 */
export function usePlayerInput(): React.MutableRefObject<InputState> {
  const inputRef = useRef<InputState>({ ...INITIAL_STATE });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          inputRef.current.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          inputRef.current.backward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = true;
          break;
        case 'Space':
          inputRef.current.jump = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          inputRef.current.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          inputRef.current.backward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          inputRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          inputRef.current.right = false;
          break;
        case 'Space':
          inputRef.current.jump = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return inputRef;
}
