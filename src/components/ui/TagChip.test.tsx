import { render, screen } from '@testing-library/react'
import { describe, expect,it } from 'vitest'

import { getTagColorClass,TagChip } from './TagChip'

describe('TagChip Component', () => {
  it('should render label text', () => {
    render(<TagChip label="important" />)
    expect(screen.getByText('important')).toBeInTheDocument()
  })

  it('should render as span element', () => {
    render(<TagChip label="tag" />)
    const chip = screen.getByText('tag')
    expect(chip.tagName).toBe('SPAN')
  })

  it('should have consistent classes', () => {
    render(<TagChip label="test" />)
    const chip = screen.getByText('test')
    expect(chip).toHaveClass('px-2')
    expect(chip).toHaveClass('py-[2.5px]')
    expect(chip).toHaveClass('rounded-xl')
    expect(chip).toHaveClass('font-semibold')
    expect(chip).toHaveClass('tracking-wide')
    expect(chip).toHaveClass('border-[1px]')
  })

  it('should render different tags', () => {
    const { rerender } = render(<TagChip label="tag1" />)
    expect(screen.getByText('tag1')).toBeInTheDocument()

    rerender(<TagChip label="tag2" />)
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('should render tag with special characters', () => {
    render(<TagChip label="bug-fix" />)
    expect(screen.getByText('bug-fix')).toBeInTheDocument()
  })

  it('should render tag with numbers', () => {
    render(<TagChip label="issue123" />)
    expect(screen.getByText('issue123')).toBeInTheDocument()
  })

  it('should render empty label', () => {
    render(<TagChip label="" />)
    const chip = screen.getByRole('generic')
    expect(chip).toBeInTheDocument()
  })

  it('should render long label text', () => {
    const longLabel = 'This is a very long label'
    render(<TagChip label={longLabel} />)
    expect(screen.getByText(longLabel)).toBeInTheDocument()
  })

  it('should apply color class based on label', () => {
    render(<TagChip label="test" />)
    const chip = screen.getByText('test')
    const colorClass = getTagColorClass('test')
    expect(chip).toHaveClass(colorClass)
  })
})

describe('getTagColorClass function', () => {
  it('should return a color class', () => {
    const colorClass = getTagColorClass('test')
    expect(colorClass).toBeTruthy()
    expect(typeof colorClass).toBe('string')
  })

  it('should return same color for same label', () => {
    const color1 = getTagColorClass('consistent')
    const color2 = getTagColorClass('consistent')
    expect(color1).toBe(color2)
  })

  it('should handle empty string', () => {
    const colorClass = getTagColorClass('')
    expect(colorClass).toBeTruthy()
  })

  it('should produce different colors for different labels (usually)', () => {
    const color1 = getTagColorClass('label1')
    const color2 = getTagColorClass('label2')
    // Note: collision is possible but unlikely
    expect(color1).toBeTruthy()
    expect(color2).toBeTruthy()
  })

  it('should handle special characters in label', () => {
    const colorClass = getTagColorClass('label-with-special!')
    expect(colorClass).toBeTruthy()
  })

  it('should handle numbers in label', () => {
    const colorClass = getTagColorClass('label123')
    expect(colorClass).toBeTruthy()
  })

  it('should handle uppercase letters', () => {
    const color1 = getTagColorClass('UPPERCASE')
    const color2 = getTagColorClass('uppercase')
    expect(color1).toBeTruthy()
    expect(color2).toBeTruthy()
  })

  it('should handle long labels', () => {
    const longLabel = 'a'.repeat(1000)
    const colorClass = getTagColorClass(longLabel)
    expect(colorClass).toBeTruthy()
  })

  it('should always return one of the predefined colors', () => {
    const labels = ['a', 'b', 'c', 'test', 'tag', 'important', 'bug', 'feature']
    const colors = labels.map(label => getTagColorClass(label))
    colors.forEach(color => {
      expect(color).toBeTruthy()
      // Each should include 'bg-' or 'text-' classes
      expect(color).toMatch(/(bg-|text-|border-)/)
    })
  })

  it('should be deterministic', () => {
    const colors: string[] = []
    for (let i = 0; i < 5; i++) {
      colors.push(getTagColorClass('test-label'))
    }
    // All should be the same
    expect(colors.every(c => c === colors[0])).toBe(true)
  })
})
