import { profile } from '../content/profile'

function Experience() {
  return (
    <section id="experience" className="section">
      <h2>Experience</h2>
      <ul className="experience-list">
        {profile.experience.map((entry) => (
          <li key={`${entry.role}-${entry.organization}`}>
            <h3>{entry.role}</h3>
            <p className="experience-meta">
              {entry.organization} &middot; {entry.period}
            </p>
            <p>{entry.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Experience
