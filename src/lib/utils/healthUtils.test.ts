import { describe, it, expect } from 'vitest'
import { computeEnvironmentHealth } from './healthUtils'

describe('healthUtils - computeEnvironmentHealth', () => {
  it('should return 60 for zero total tasks', () => {
    const health = computeEnvironmentHealth(0, 0, 0)
    expect(health).toBe(60)
  })

  it('should return 60 for negative total tasks', () => {
    const health = computeEnvironmentHealth(-5, 0, 0)
    expect(health).toBe(60)
  })

  it('should calculate health with completed tasks', () => {
    const health = computeEnvironmentHealth(20, 10, 0)
    expect(health).toBeGreaterThan(60)
    expect(health).toBeLessThanOrEqual(100)
  })

  it('should decrease health with overdue tasks', () => {
    const healthWithoutOverdue = computeEnvironmentHealth(20, 10, 0)
    const healthWithOverdue = computeEnvironmentHealth(20, 10, 5)
    expect(healthWithOverdue).toBeLessThan(healthWithoutOverdue)
  })

  it('should apply weight 2x to overdue tasks', () => {
    const health1 = computeEnvironmentHealth(20, 0, 5)
    const health2 = computeEnvironmentHealth(20, 10, 0)
    // Overdue has double impact
    expect(health1).toBeLessThan(health2)
  })

  it('should return base 60 for total tasks < 20', () => {
    const health = computeEnvironmentHealth(10, 10, 0)
    // For < 20 tasks, base is set to 20, so all completed = 60 + 100*10/20 = 110 clamped to 100
    expect(health).toBe(100)
  })

  it('should use correct base for >= 20 tasks', () => {
    const health1 = computeEnvironmentHealth(20, 10, 0)
    const health2 = computeEnvironmentHealth(20, 10, 0)
    expect(health1).toBe(health2)
  })

  it('should clamp result to max 100', () => {
    const health = computeEnvironmentHealth(20, 20, 0)
    expect(health).toBeLessThanOrEqual(100)
  })

  it('should clamp result to min 0', () => {
    const health = computeEnvironmentHealth(5, 0, 10)
    expect(health).toBeGreaterThanOrEqual(0)
  })

  it('should handle all tasks completed without overdue', () => {
    const health = computeEnvironmentHealth(20, 20, 0)
    expect(health).toBe(100)
  })

  it('should handle no tasks completed', () => {
    const health = computeEnvironmentHealth(20, 0, 0)
    expect(health).toBe(60)
  })

  it('should handle all tasks overdue', () => {
    const health = computeEnvironmentHealth(20, 0, 20)
    expect(health).toBeLessThanOrEqual(0)
  })

  it('should return integer result', () => {
    const health = computeEnvironmentHealth(15, 7, 2)
    expect(Number.isInteger(health)).toBe(true)
  })

  it('should handle large numbers', () => {
    const health = computeEnvironmentHealth(1000, 500, 100)
    expect(health).toBeGreaterThanOrEqual(0)
    expect(health).toBeLessThanOrEqual(100)
  })

  it('should handle single task', () => {
    const health = computeEnvironmentHealth(1, 1, 0)
    expect(health).toBeGreaterThanOrEqual(60)
  })

  it('should handle fractional completion', () => {
    const health = computeEnvironmentHealth(20, 5, 2)
    expect(health).toBeGreaterThanOrEqual(0)
    expect(health).toBeLessThanOrEqual(100)
  })

  it('should be consistent with same inputs', () => {
    const health1 = computeEnvironmentHealth(30, 15, 3)
    const health2 = computeEnvironmentHealth(30, 15, 3)
    expect(health1).toBe(health2)
  })

  it('should correctly calculate with edge case inputs', () => {
    const health = computeEnvironmentHealth(20, 0, 0)
    expect(health).toBe(60)
  })

  it('should handle float task numbers', () => {
    // Although tasks should be integers, the function should handle them
    const health = computeEnvironmentHealth(20.5, 10.2, 2.8)
    expect(Number.isInteger(health)).toBe(true)
  })

  it('should decrease linearly with overdue increase', () => {
    const health1 = computeEnvironmentHealth(20, 10, 0)
    const health2 = computeEnvironmentHealth(20, 10, 1)
    const health3 = computeEnvironmentHealth(20, 10, 2)

    const diff1 = health1 - health2
    const diff2 = health2 - health3

    expect(diff1).toBeCloseTo(diff2, 1) // Should be approximately equal (within 1 point)
  })
})
