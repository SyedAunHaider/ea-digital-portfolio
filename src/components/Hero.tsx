import { profile } from '../content/profile'
import profilePhoto from '../assets/profile-photo.svg'

function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-photo-wrap">
        <img src={profilePhoto} alt="Syed Aun Haider" className="hero-photo" />
      </div>
      <h1>{profile.name}</h1>
      <p className="hero-role">{profile.role}</p>
      <p className="hero-tagline">{profile.tagline}</p>
    </section>
  )
}

export default Hero
