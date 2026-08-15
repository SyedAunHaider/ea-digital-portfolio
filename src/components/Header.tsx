import { useState } from 'react'

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
]

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <a className="site-header-brand" href="#hero">
          Syed Aun Haider
        </a>
        <nav
          id="primary-nav"
          aria-label="Primary"
          className={isNavOpen ? 'primary-nav is-open' : 'primary-nav'}
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsNavOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isNavOpen}
          aria-controls="primary-nav"
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </div>
    </header>
  )
}

export default Header
