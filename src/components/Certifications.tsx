import { profile } from '../content/profile'

function Certifications() {
  return (
    <section id="certifications" className="section">
      <h2>Certifications</h2>
      {profile.certifications.length > 0 ? (
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
      ) : (
        <p className="certifications-placeholder">Certifications coming soon.</p>
      )}
    </section>
  )
}

export default Certifications
