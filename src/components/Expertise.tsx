import { profile } from '../content/profile'

function Expertise() {
  return (
    <section id="expertise" className="section">
      <h2>Expertise</h2>
      <ul className="expertise-list">
        {profile.expertise.map((area) => (
          <li key={area.title}>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Expertise
