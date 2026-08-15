import { profile } from '../content/profile'

function Hero() {
  return (
    <section id="hero" className="hero-section">
      <h1>{profile.name}</h1>
      <p className="hero-role">{profile.role}</p>
      <p className="hero-tagline">{profile.tagline}</p>
    </section>
  )
}

export default Hero
