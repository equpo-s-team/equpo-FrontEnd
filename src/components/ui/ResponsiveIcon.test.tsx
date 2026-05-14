import { render, screen } from '@testing-library/react'
import { Bell,Heart, Star } from 'lucide-react'
import { describe, expect,it } from 'vitest'

import { ResponsiveIcon } from './ResponsiveIcon'

describe('ResponsiveIcon Component', () => {
  it('should render icon component', () => {
    const { container } = render(
      <ResponsiveIcon component={Heart} mobileSize={20} desktopSize={24} />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render different icon types', () => {
    const { container, rerender } = render(
      <ResponsiveIcon component={Heart} mobileSize={20} desktopSize={24} />
    )
    let svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    rerender(<ResponsiveIcon component={Star} mobileSize={20} desktopSize={24} />)
    svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should accept additional props', () => {
    render(
      <ResponsiveIcon
        component={Heart}
        mobileSize={20}
        desktopSize={24}
        data-testid="responsive-icon"
      />
    )
    const element = screen.getByTestId('responsive-icon')
    expect(element).toBeInTheDocument()
  })

  it('should pass className prop to icon', () => {
    render(
      <ResponsiveIcon
        component={Heart}
        mobileSize={20}
        desktopSize={24}
        className="text-red-500"
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('text-red-500')
  })

  it('should pass color prop to icon', () => {
    render(
      <ResponsiveIcon
        component={Star}
        mobileSize={16}
        desktopSize={24}
        color="gold"
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('color', 'gold')
  })

  it('should handle different size combinations', () => {
    const { rerender } = render(
      <ResponsiveIcon component={Bell} mobileSize={16} desktopSize={32} />
    )
    expect(document.querySelector('svg')).toBeInTheDocument()

    rerender(
      <ResponsiveIcon component={Bell} mobileSize={12} desktopSize={28} />
    )
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('should render multiple instances independently', () => {
    const { container } = render(
      <>
        <ResponsiveIcon component={Heart} mobileSize={20} desktopSize={24} />
        <ResponsiveIcon component={Star} mobileSize={18} desktopSize={22} />
        <ResponsiveIcon component={Bell} mobileSize={16} desktopSize={20} />
      </>
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(3)
  })

  it('should accept strokeWidth prop', () => {
    render(
      <ResponsiveIcon
        component={Heart}
        mobileSize={20}
        desktopSize={24}
        strokeWidth={1.5}
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('stroke-width', '1.5')
  })

  it('should accept aria-label for accessibility', () => {
    render(
      <ResponsiveIcon
        component={Heart}
        mobileSize={20}
        desktopSize={24}
        aria-label="Like button"
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Like button')
  })

  it('should render different icon sizes', () => {
    render(
      <ResponsiveIcon component={Heart} mobileSize={8} desktopSize={40} />
    )
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should work with role attribute', () => {
    render(
      <ResponsiveIcon
        component={Star}
        mobileSize={20}
        desktopSize={24}
        role="img"
        aria-label="Rating"
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('role', 'img')
  })

  it('should handle absolute positioning', () => {
    render(
      <ResponsiveIcon
        component={Bell}
        mobileSize={16}
        desktopSize={24}
        className="absolute top-0 right-0"
      />
    )
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('absolute')
  })
})
