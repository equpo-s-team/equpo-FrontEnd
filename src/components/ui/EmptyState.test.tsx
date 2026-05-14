import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Box,Heart, Search } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState Component', () => {
  it('should render title text', () => {
    render(<EmptyState icon={Search} title="No Results" />)
    expect(screen.getByText('No Results')).toBeInTheDocument()
  })

  it('should render icon', () => {
    const { container } = render(<EmptyState icon={Search} title="No Results" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(
      <EmptyState
        icon={Search}
        title="No Results"
        description="Try a different search term"
      />
    )
    expect(screen.getByText('Try a different search term')).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    render(<EmptyState icon={Search} title="No Results" />)
    const description = screen.queryByText(/description/i)
    expect(description).not.toBeInTheDocument()
  })

  it('should render action button when action provided', () => {
    render(
      <EmptyState
        icon={Search}
        title="No Results"
        action={{ label: 'Try Again', onClick: () => {} }}
      />
    )
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('should not render action button when action not provided', () => {
    render(<EmptyState icon={Search} title="No Results" />)
    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  it('should call action onClick when button clicked', async () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={Search}
        title="No Results"
        action={{ label: 'Retry', onClick: handleClick }}
      />
    )

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should apply default size (md)', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('py-10')
  })

  it('should apply small size when specified', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" size="sm" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('py-6')
  })

  it('should apply large size when specified', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" size="lg" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('py-16')
  })

  it('should render with different icons', () => {
    const { rerender, container } = render(
      <EmptyState icon={Search} title="Search Empty" />
    )
    let svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    rerender(<EmptyState icon={Heart} title="Favorites Empty" />)
    svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render with multiple action buttons in different states', async () => {
    const handleClick1 = vi.fn()
    const handleClick2 = vi.fn()

    const { rerender } = render(
      <EmptyState
        icon={Search}
        title="First State"
        action={{ label: 'Action 1', onClick: handleClick1 }}
      />
    )

    let button = screen.getByRole('button')
    await userEvent.click(button)
    expect(handleClick1).toHaveBeenCalledOnce()

    rerender(
      <EmptyState
        icon={Box}
        title="Second State"
        action={{ label: 'Action 2', onClick: handleClick2 }}
      />
    )

    button = screen.getByRole('button')
    await userEvent.click(button)
    expect(handleClick2).toHaveBeenCalledOnce()
  })

  it('should accept custom className', () => {
    const { container } = render(
      <EmptyState icon={Search} title="Empty" className="custom-class" />
    )
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  it('should accept custom icon className', () => {
    const { container } = render(
      <EmptyState icon={Search} title="Empty" iconClassName="custom-icon" />
    )
    const iconBox = container.querySelector('div div')
    expect(iconBox).toHaveClass('custom-icon')
  })

  it('should have flex center layout', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex')
    expect(wrapper).toHaveClass('flex-col')
    expect(wrapper).toHaveClass('items-center')
    expect(wrapper).toHaveClass('justify-center')
  })

  it('should have text-center class', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('text-center')
  })

  it('should render complete empty state with all props', () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={Search}
        title="No Items Found"
        description="Your search returned no results"
        action={{ label: 'Clear Filters', onClick: handleClick }}
        size="lg"
        className="mt-8"
      />
    )

    expect(screen.getByText('No Items Found')).toBeInTheDocument()
    expect(screen.getByText('Your search returned no results')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear Filters' })).toBeInTheDocument()
  })

  it('should render minimal empty state', () => {
    render(<EmptyState icon={Search} title="Empty" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should have icon background styling', () => {
    const { container } = render(<EmptyState icon={Search} title="Empty" />)
    const iconBox = container.querySelector('div div')
    expect(iconBox).toHaveClass('rounded-2xl')
    expect(iconBox).toHaveClass('bg-secondary')
    expect(iconBox).toHaveClass('mb-4')
  })

  it('should render button with outline variant', () => {
    render(
      <EmptyState
        icon={Search}
        title="Empty"
        action={{ label: 'Action', onClick: () => {} }}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })
})
