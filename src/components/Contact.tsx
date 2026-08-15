import { profile } from '../content/profile'

function Contact() {
  return (
    <section id="contact" className="section">
      <h2>Contact</h2>
      <div className="contact-links">
        <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
        <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
      <p className="contact-location">{profile.contact.location}</p>
    </section>
  )
}

export default Contact
