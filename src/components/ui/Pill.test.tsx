import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pill } from './Pill'

describe('Pill Component', () => {
  it('should render pill with children text', () => {
    render(<Pill>Filter</Pill>)
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument()
  })

  it('should render button element', () => {
    render(<Pill>Click me</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toBeInTheDocument()
    expect(pill.tagName).toBe('BUTTON')
  })

  it('should apply active styles when active=true', () => {
    render(<Pill active={true}>Active</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('text-blue')
  })

  it('should apply inactive styles when active=false', () => {
    render(<Pill active={false}>Inactive</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('text-grey-500')
  })

  it('should apply default active state (false)', () => {
    render(<Pill>Default</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('text-grey-500')
  })

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Pill onClick={handleClick}>Click me</Pill>)

    const pill = screen.getByRole('button')
    await userEvent.click(pill)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should handle multiple clicks', async () => {
    const handleClick = vi.fn()
    render(<Pill onClick={handleClick}>Click</Pill>)

    const pill = screen.getByRole('button')
    await userEvent.click(pill)
    await userEvent.click(pill)
    await userEvent.click(pill)

    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it('should apply custom className', () => {
    render(<Pill className="custom-class">Custom</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('custom-class')
  })

  it('should combine default classes with custom className', () => {
    render(<Pill className="mt-4">Styled</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('px-3')
    expect(pill).toHaveClass('py-1.5')
    expect(pill).toHaveClass('mt-4')
  })

  it('should have cursor-pointer class', () => {
    render(<Pill>Clickable</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('cursor-pointer')
  })

  it('should have rounded-full class', () => {
    render(<Pill>Rounded</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('rounded-full')
  })

  it('should have whitespace-nowrap class', () => {
    render(<Pill>No Wrap</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('whitespace-nowrap')
  })

  it('should have select-none class', () => {
    render(<Pill>Select None</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('select-none')
  })

  it('should support children as elements', () => {
    render(
      <Pill>
        <span>Icon</span> Label
      </Pill>
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('should handle empty children', () => {
    render(<Pill></Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toBeInTheDocument()
  })

  it('should toggle active state on click', async () => {
    const { rerender } = render(<Pill active={false}>Toggle</Pill>)
    let pill = screen.getByRole('button')
    expect(pill).toHaveClass('text-grey-500')

    rerender(<Pill active={true}>Toggle</Pill>)
    pill = screen.getByRole('button')
    expect(pill).toHaveClass('text-blue')
  })

  it('should support border class', () => {
    render(<Pill>Border</Pill>)
    const pill = screen.getByRole('button')
    expect(pill).toHaveClass('border')
  })
})
