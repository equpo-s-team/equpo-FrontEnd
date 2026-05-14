import { render, screen } from '@testing-library/react'
import { describe, expect,it } from 'vitest'

import { FieldLabel } from './FieldLabel'

describe('FieldLabel Component', () => {
  it('should render label with children text', () => {
    render(<FieldLabel>Email</FieldLabel>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('should render as label element', () => {
    render(<FieldLabel>Name</FieldLabel>)
    const label = screen.getByText('Name').closest('label')
    expect(label).toBeInTheDocument()
  })

  it('should have correct text styling classes', () => {
    render(<FieldLabel>Password</FieldLabel>)
    const label = screen.getByText('Password')
    expect(label).toHaveClass('text-xs')
    expect(label).toHaveClass('font-semibold')
  })

  it('should have correct color classes', () => {
    render(<FieldLabel>Username</FieldLabel>)
    const label = screen.getByText('Username')
    expect(label).toHaveClass('text-grey-600')
  })

  it('should have uppercase tracking', () => {
    render(<FieldLabel>Field</FieldLabel>)
    const label = screen.getByText('Field')
    expect(label).toHaveClass('uppercase')
    expect(label).toHaveClass('tracking-wide')
  })

  it('should have bottom margin', () => {
    render(<FieldLabel>Label</FieldLabel>)
    const label = screen.getByText('Label')
    expect(label).toHaveClass('mb-1.5')
  })

  it('should display block', () => {
    render(<FieldLabel>Block Label</FieldLabel>)
    const label = screen.getByText('Block Label')
    expect(label).toHaveClass('block')
  })

  it('should not render required indicator by default', () => {
    render(<FieldLabel>Optional Field</FieldLabel>)
    const asterisk = screen.queryByText('*')
    expect(asterisk).not.toBeInTheDocument()
  })

  it('should render required indicator when required=true', () => {
    render(<FieldLabel required={true}>Required Field</FieldLabel>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should render required indicator with left margin', () => {
    render(<FieldLabel required={true}>Required</FieldLabel>)
    const asterisk = screen.getByText('*')
    expect(asterisk).toHaveClass('ml-0.5')
  })

  it('should render required indicator with red color', () => {
    render(<FieldLabel required={true}>Required</FieldLabel>)
    const asterisk = screen.getByText('*')
    expect(asterisk).toHaveClass('text-red')
  })

  it('should render required=false explicitly', () => {
    render(<FieldLabel required={false}>Optional</FieldLabel>)
    const asterisk = screen.queryByText('*')
    expect(asterisk).not.toBeInTheDocument()
  })

  it('should render label with multiple words', () => {
    render(<FieldLabel>Email Address</FieldLabel>)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('should render label with special characters', () => {
    render(<FieldLabel>Phone Number (Optional)</FieldLabel>)
    expect(screen.getByText('Phone Number (Optional)')).toBeInTheDocument()
  })

  it('should render children as ReactNode', () => {
    render(
      <FieldLabel>
        <span>Custom</span> Label
      </FieldLabel>
    )
    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('should have correct label element structure', () => {
    render(
      <FieldLabel required={true}>
        Test Field
      </FieldLabel>
    )
    const label = screen.getByText('Test Field').closest('label')
    expect(label?.children.length).toBeGreaterThan(1) // Has text + asterisk
  })

  it('should render empty label gracefully', () => {
    render(<FieldLabel>{''}</FieldLabel>)
    const label = screen.getByRole('generic', { hidden: true })
    expect(label).toBeInTheDocument()
  })

  it('should support long label text', () => {
    const longText = 'This is a very long label that might wrap on smaller screens'
    render(<FieldLabel>{longText}</FieldLabel>)
    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})
