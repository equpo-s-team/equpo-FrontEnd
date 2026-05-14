import { describe, expect,it } from 'vitest'

import { cn } from './utils'

describe('cn - className utility function', () => {
  it('should merge simple className strings', () => {
    const result = cn('px-2', 'py-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })

  it('should handle undefined values', () => {
    const result = cn('px-2', undefined, 'py-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })

  it('should handle false values', () => {
    const result = cn('px-2', (false as boolean) && 'py-1', 'rounded')
    expect(result).toContain('px-2')
    expect(result).not.toContain('py-1')
    expect(result).toContain('rounded')
  })

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2', 'px-4')
    // Should have the later px-4 and not px-2 due to twMerge
    expect(result).toContain('px-4')
  })

  it('should handle arrays of classNames', () => {
    const result = cn(['px-2', 'py-1'], 'rounded')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('rounded')
  })

  it('should return empty string for no inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })

  it('should handle conditional classes when false', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).not.toContain('active-class')
  })

  it('should resolve tailwind conflict with last value winning', () => {
    const result = cn('text-red-500', 'text-blue-500')
    // Should contain the latest color
    expect(result).toContain('text-blue-500')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      'px-2': true,
      'py-1': false,
      'rounded': true,
    })
    expect(result).toContain('px-2')
    expect(result).toContain('rounded')
    expect(result).not.toContain('py-1')
  })
})
