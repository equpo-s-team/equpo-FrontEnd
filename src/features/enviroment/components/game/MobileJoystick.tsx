import {ArrowUpFromLine} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from 'react';

import { type InputState } from '../../hooks/usePlayerInput';
import {
  JOYSTICK_DEAD_ZONE,
  JOYSTICK_JUMP_SIZE,
  JOYSTICK_SIZE,
  JOYSTICK_THUMB_SIZE,
} from '../../lib/physicsConstants';

interface MobileJoystickProps {
  inputRef: React.MutableRefObject<InputState>;
}

export function MobileJoystick({ inputRef }: MobileJoystickProps) {
  const [active, setActive] = useState(false);
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 });
  const basePos = useRef({ x: 0, y: 0 });
  const pointerId = useRef<number | null>(null);

  const maxRadius = (JOYSTICK_SIZE - JOYSTICK_THUMB_SIZE) / 2;

  const applyJoystick = useCallback(
    (dx: number, dy: number) => {
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, maxRadius);
      const angle = Math.atan2(dy, dx);

      const clampedX = Math.cos(angle) * clampedDist;
      const clampedY = Math.sin(angle) * clampedDist;

      setThumbPos({ x: clampedX, y: clampedY });

      // Normalize to -1..1
      const nx = clampedX / maxRadius;
      const ny = clampedY / maxRadius;

      const forward = ny < -JOYSTICK_DEAD_ZONE;
      const backward = ny > JOYSTICK_DEAD_ZONE;
      const left = nx < -JOYSTICK_DEAD_ZONE;
      const right = nx > JOYSTICK_DEAD_ZONE;

      inputRef.current.forward = forward;
      inputRef.current.backward = backward;
      inputRef.current.left = left;
      inputRef.current.right = right;
    },
    [maxRadius, inputRef],
  );

  const resetJoystick = useCallback(() => {
    setThumbPos({ x: 0, y: 0 });
    setActive(false);
    pointerId.current = null;
    inputRef.current.forward = false;
    inputRef.current.backward = false;
    inputRef.current.left = false;
    inputRef.current.right = false;
  }, [inputRef]);

  const handlePointerStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'touch') return;
      pointerId.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      basePos.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setActive(true);
      applyJoystick(e.clientX - basePos.current.x, e.clientY - basePos.current.y);
    },
    [applyJoystick],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== e.pointerId) return;
      applyJoystick(e.clientX - basePos.current.x, e.clientY - basePos.current.y);
    },
    [applyJoystick],
  );

  const handlePointerEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== e.pointerId) return;
      pointerId.current = null;
      resetJoystick();
    },
    [resetJoystick],
  );

  const handleJumpStart = useCallback(() => {
    inputRef.current.jump = true;
  }, [inputRef]);

  const handleJumpEnd = useCallback(() => {
    inputRef.current.jump = false;
  }, [inputRef]);

  // Clean up if touch is cancelled (e.g. incoming call)
  useEffect(() => {
    const onCancel = () => resetJoystick();
    window.addEventListener('touchcancel', onCancel);
    return () => window.removeEventListener('touchcancel', onCancel);
  }, [resetJoystick]);

  const half = JOYSTICK_SIZE / 2;
  const thumbHalf = JOYSTICK_THUMB_SIZE / 2;

  return (
    <>
      <div
        className="absolute bottom-8 left-8 z-30 touch-none select-none"
        style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
        onPointerDown={handlePointerStart}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm"
          style={{ opacity: active ? 0.9 : 0.55, transition: 'opacity 0.15s ease' }}
        />

        {/* Thumb */}
        <div
          className="absolute rounded-full bg-white/50 border border-white/60 shadow-lg"
          style={{
            width: JOYSTICK_THUMB_SIZE,
            height: JOYSTICK_THUMB_SIZE,
            left: half - thumbHalf + thumbPos.x,
            top: half - thumbHalf + thumbPos.y,
            transition: active ? 'none' : 'left 0.15s ease, top 0.15s ease',
            boxShadow: active ? '0 0 14px rgba(255,255,255,0.5)' : 'none',
          }}
        />

        {/* Arrows indicator (decorative) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="white">
            <path d="M18 4l-4 6h8l-4-6z" />
            <path d="M18 32l4-6h-8l4 6z" />
            <path d="M4 18l6 4v-8l-6 4z" />
            <path d="M32 18l-6-4v8l6-4z" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-10 right-8 z-30 flex items-center justify-center rounded-full border-2 border-white/30 bg-white/15 font-body text-sm text-white shadow-lg touch-none select-none"
        style={{ width: JOYSTICK_JUMP_SIZE, height: JOYSTICK_JUMP_SIZE }}
        onPointerDown={handleJumpStart}
        onPointerUp={handleJumpEnd}
        onPointerCancel={handleJumpEnd}
      >
        <ArrowUpFromLine className="w-8 h-8"/>
      </button>
    </>
  );
}
