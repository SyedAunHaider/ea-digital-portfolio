import { profile } from '../content/profile'

function About() {
  return (
    <section id="about" className="section">
      <h2>About Me</h2>
      {profile.about.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  )
}

export default About
