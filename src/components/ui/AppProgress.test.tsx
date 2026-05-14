import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AppProgress } from './AppProgress'

describe('AppProgress Component', () => {
  it('should render progress bar', () => {
    const { container } = render(<AppProgress value={50} />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('should display 0% progress', () => {
    const { container } = render(<AppProgress value={0} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 0%')
  })

  it('should display 50% progress', () => {
    const { container } = render(<AppProgress value={50} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 50%')
  })

  it('should display 100% progress', () => {
    const { container } = render(<AppProgress value={100} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 100%')
  })

  it('should clamp values above 100 to 100', () => {
    const { container } = render(<AppProgress value={150} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 100%')
  })

  it('should clamp negative values to 0', () => {
    const { container } = render(<AppProgress value={-50} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 0%')
  })

  it('should have default height h-1', () => {
    const { container } = render(<AppProgress value={50} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('h-1')
  })

  it('should apply custom height', () => {
    const { container } = render(<AppProgress value={50} height="h-2" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('h-2')
  })

  it('should apply gradient class', () => {
    const { container } = render(<AppProgress value={50} gradient="bg-gradient-to-r" />)
    const progress = container.querySelector('[class*="gradient"]')
    expect(progress).toHaveClass('bg-gradient-to-r')
  })

  it('should apply gradient style inline', () => {
    const { container } = render(
      <AppProgress value={50} gradientStyle="linear-gradient(90deg, red, blue)" />
    )
    const progress = container.querySelector('[style*="background"]')
    expect(progress).toHaveStyle('background: linear-gradient(90deg, red, blue)')
  })

  it('should apply glow effect', () => {
    const { container } = render(
      <AppProgress value={50} glow="0 0 10px rgba(255, 0, 0, 0.5)" />
    )
    const progress = container.querySelector('[style*="boxShadow"]')
    expect(progress).toHaveStyle('box-shadow: 0 0 10px rgba(255, 0, 0, 0.5)')
  })

  it('should apply custom className', () => {
    const { container } = render(<AppProgress value={50} className="custom-class" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })

  it('should have w-full class', () => {
    const { container } = render(<AppProgress value={50} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('w-full')
  })

  it('should have rounded-full class', () => {
    const { container } = render(<AppProgress value={50} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('rounded-full')
  })

  it('should have overflow-hidden', () => {
    const { container } = render(<AppProgress value={50} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('overflow-hidden')
  })

  it('should show glow element when value > 0', () => {
    const { container } = render(<AppProgress value={25} />)
    const glowElement = container.querySelector('[class*="blur"]')
    expect(glowElement).toBeInTheDocument()
  })

  it('should not show glow element when value = 0', () => {
    const { container } = render(<AppProgress value={0} />)
    const glowElement = container.querySelector('[class*="blur"]')
    expect(glowElement).not.toBeInTheDocument()
  })

  it('should have transition effect', () => {
    const { container } = render(<AppProgress value={50} />)
    const progress = container.querySelector('[class*="transition"]')
    expect(progress).toHaveClass('transition-[width]')
  })

  it('should update progress on value change', () => {
    const { rerender, container } = render(<AppProgress value={25} />)
    let progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 25%')

    rerender(<AppProgress value={75} />)
    progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 75%')
  })

  it('should handle fractional values', () => {
    const { container } = render(<AppProgress value={33.333} />)
    const progress = container.querySelector('[style*="width"]')
    expect(progress).toHaveStyle('width: 33.333%')
  })

  it('should render with all props', () => {
    const { container } = render(
      <AppProgress
        value={60}
        gradient="bg-gradient-to-r from-purple-500 to-pink-500"
        gradientStyle="linear-gradient(90deg, #a855f7, #ec4899)"
        glow="0 0 20px rgba(168, 85, 247, 0.6)"
        height="h-3"
        className="mt-4 mb-4"
      />
    )
    const wrapper = container.firstChild
    const progress = container.querySelector('[style*="width"]')
    
    expect(wrapper).toHaveClass('h-3')
    expect(wrapper).toHaveClass('mt-4')
    expect(wrapper).toHaveClass('mb-4')
    expect(progress).toHaveStyle('width: 60%')
  })
})
