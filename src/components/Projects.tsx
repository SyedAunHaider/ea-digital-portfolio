import { profile } from '../content/profile'

function Projects() {
  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <ul className="projects-list">
        {profile.projects.map((project) => (
          <li key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies.join(', ')}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Projects
