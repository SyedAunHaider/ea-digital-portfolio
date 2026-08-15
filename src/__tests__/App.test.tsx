import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../App'
import { profile } from '../content/profile'

describe('App (homepage)', () => {
  it('renders the name in a single h1', () => {
    render(<App />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(profile.name)
  })

  it('displays "Enterprise Architect"', () => {
    render(<App />)
    const heroSection = document.querySelector('#hero') as HTMLElement
    expect(within(heroSection).getByText('Enterprise Architect')).toBeInTheDocument()
  })

  it('displays "16+ Years of Technology Experience"', () => {
    render(<App />)
    expect(
      screen.getByText('16+ Years of Technology Experience'),
    ).toBeInTheDocument()
  })

  it('renders an About Me section with expected content', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 2, name: 'About Me' })
    const section = heading.closest('section')
    expect(section).toHaveAttribute('id', 'about')
    expect(section).toHaveTextContent(profile.about[0])
  })

  it('renders an Expertise section with expected content', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Expertise' })
    const section = heading.closest('section')
    expect(section).toHaveAttribute('id', 'expertise')
    profile.expertise.forEach((area) => {
      expect(section).toHaveTextContent(area.title)
    })
  })

  it('renders an Experience section with expected content', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Experience' })
    const section = heading.closest('section')
    expect(section).toHaveAttribute('id', 'experience')
    profile.experience.forEach((entry) => {
      expect(section).toHaveTextContent(entry.role)
      expect(section).toHaveTextContent(entry.organization)
    })
  })

  it('renders a Contact section with a working mailto link', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Contact' })
    const section = heading.closest('section')
    expect(section).toHaveAttribute('id', 'contact')

    const mailLink = screen.getByRole('link', { name: profile.contact.email })
    expect(mailLink).toHaveAttribute('href', `mailto:${profile.contact.email}`)
  })

  it('has a heading hierarchy of one h1 and h2s for each section', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.map((h) => h.textContent)).toEqual([
      'About Me',
      'Expertise',
      'Experience',
      'Contact',
    ])
  })

  it('renders all five sections in order', () => {
    const { container } = render(<App />)
    const sectionIds = Array.from(container.querySelectorAll('section')).map(
      (section) => section.id,
    )
    expect(sectionIds).toEqual([
      'hero',
      'about',
      'expertise',
      'experience',
      'contact',
    ])
  })
})
