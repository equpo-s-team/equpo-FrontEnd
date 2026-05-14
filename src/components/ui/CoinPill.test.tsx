import { render, screen } from '@testing-library/react'
import { describe, expect,it } from 'vitest'

import { CoinPill } from './CoinPill'

describe('CoinPill Component', () => {
  it('should render coin icon', () => {
    render(<CoinPill amount={100} />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render amount as formatted number', () => {
    render(<CoinPill amount={1000} />)
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('should format large numbers with commas', () => {
    render(<CoinPill amount={1234567} />)
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('should render single digit amount', () => {
    render(<CoinPill amount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render zero amount', () => {
    render(<CoinPill amount={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should render label when provided', () => {
    render(<CoinPill amount={100} label="coins" />)
    expect(screen.getByText('COINS')).toBeInTheDocument()
  })

  it('should not render label when not provided', () => {
    render(<CoinPill amount={100} />)
    const labels = screen.queryByText(/COINS/i)
    expect(labels).not.toBeInTheDocument()
  })

  it('should apply member variant by default', () => {
    const { container } = render(<CoinPill amount={100} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-yellow-50')
  })

  it('should apply member variant when specified', () => {
    const { container } = render(<CoinPill amount={100} variant="member" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-yellow-50')
    expect(wrapper).toHaveClass('border-orange-200')
  })

  it('should apply team variant styles', () => {
    const { container } = render(<CoinPill amount={100} variant="team" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-violet-50')
    expect(wrapper).toHaveClass('border-violet-200')
  })

  it('should have dark mode styles for team variant', () => {
    const { container } = render(<CoinPill amount={100} variant="team" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('dark:bg-violet-900/20')
    expect(wrapper).toHaveClass('dark:border-violet-700')
  })

  it('should have dark mode styles for member variant', () => {
    const { container } = render(<CoinPill amount={100} variant="member" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('dark:bg-yellow-900/20')
    expect(wrapper).toHaveClass('dark:border-orange-700')
  })

  it('should accept custom className', () => {
    const { container } = render(<CoinPill amount={100} className="custom-class" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  it('should combine default classes with custom className', () => {
    const { container } = render(<CoinPill amount={100} className="mt-2" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex')
    expect(wrapper).toHaveClass('items-center')
    expect(wrapper).toHaveClass('mt-2')
  })

  it('should render all text content', () => {
    render(<CoinPill amount={500} label="team" />)
    expect(screen.getByText('TEAM')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('should have rounded-xl class', () => {
    const { container } = render(<CoinPill amount={100} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('rounded-xl')
  })

  it('should have border class', () => {
    const { container } = render(<CoinPill amount={100} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('border')
  })

  it('should handle negative amounts', () => {
    render(<CoinPill amount={-100} />)
    expect(screen.getByText('-100')).toBeInTheDocument()
  })

  it('should render decimal amounts correctly', () => {
    render(<CoinPill amount={99.99} />)
    expect(screen.getByText('99.99')).toBeInTheDocument()
  })
})
