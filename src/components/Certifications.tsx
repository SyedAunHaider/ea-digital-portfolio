import { profile } from '../content/profile'

function Certifications() {
  return (
    <section id="certifications" className="section">
      <h2>Certifications</h2>
      <ul className="certifications-list">
        {profile.certifications.map((cert) => (
          <li key={`${cert.name}-${cert.issuer}`}>
            <h3>{cert.name}</h3>
            <p className="certifications-meta">
              {cert.issuer} &middot; {cert.year}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Certifications
