import { useEffect, useState } from 'react';

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function useKeyboardControls(): KeyboardState {
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setKeys((k) => ({ ...k, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys((k) => ({ ...k, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setKeys((k) => ({ ...k, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys((k) => ({ ...k, right: false }));
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

  return keys;
}
