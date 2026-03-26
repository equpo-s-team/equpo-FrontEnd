import { useState, useEffect, useRef } from 'react'

export function useAnimatedNumber(target: number, duration = 500): number {
  const [current, setCurrent] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    if (prevTarget.current === target) return
    const from = prevTarget.current
    prevTarget.current = target
    const start = performance.now()

    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setCurrent(Math.round(from + (target - from) * ease))
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [target, duration])

  return current
}
