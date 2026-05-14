import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
  })

  it('should render button with children', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should support disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply default variant class', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
  })

  it('should apply destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('should apply outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('should apply ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('should apply link variant', () => {
    render(<Button variant="link">Link</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary')
  })

  it('should apply default size', () => {
    render(<Button>Default Size</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')
  })

  it('should apply small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-8')
  })

  it('should apply large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')
  })

  it('should apply icon size', () => {
    render(<Button size="icon">🔍</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')
    expect(button).toHaveClass('w-9')
  })

  it('should combine variant and size', () => {
    render(
      <Button variant="outline" size="sm">
        Small Outline
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('h-8')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should support type attribute', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    )
    const button = screen.getByTestId('submit-btn')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should support aria-label', () => {
    render(<Button aria-label="Save changes">Save</Button>)
    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toBeInTheDocument()
  })
})
