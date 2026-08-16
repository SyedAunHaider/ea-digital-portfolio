export interface ExpertiseArea {
  title: string
  description: string
}

export interface ExperienceEntry {
  role: string
  organization: string
  period: string
  summary: string
}

export interface ContactInfo {
  email: string
  linkedin: string
  location: string
}

export interface Certification {
  name: string
  issuer: string
  year: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
}

export interface Profile {
  name: string
  role: string
  tagline: string
  about: string[]
  expertise: ExpertiseArea[]
  experience: ExperienceEntry[]
  projects: Project[]
  certifications: Certification[]
  contact: ContactInfo
}

export const profile: Profile = {
  name: 'Syed Aun Haider',
  role: 'Enterprise Architect',
  tagline: '16+ Years of Technology Experience',
  about: [
    "I'm an Enterprise Architect with over 16 years of experience helping organizations align technology strategy with business outcomes.",
    'I specialize in designing scalable, secure, and maintainable systems that bridge the gap between business goals and engineering execution, partnering with stakeholders across the organization to turn strategy into working software.',
  ],
  expertise: [
    {
      title: 'Enterprise Architecture',
      description:
        'Defining target-state architectures, governance frameworks, and roadmaps that align IT capabilities with business strategy.',
    },
    {
      title: 'Cloud & Infrastructure Strategy',
      description:
        'Leading cloud migration, modernization, and multi-cloud strategy across large-scale enterprise environments.',
    },
    {
      title: 'Solution Design',
      description:
        'Architecting scalable, secure, and resilient systems spanning integration, data, and application layers.',
    },
    {
      title: 'Technology Leadership',
      description:
        'Advising executive stakeholders and leading cross-functional teams through complex digital transformation initiatives.',
    },
  ],
  experience: [
    {
      role: 'Enterprise Architect',
      organization: 'Independent Consulting',
      period: '2018 - Present',
      summary:
        'Leading enterprise architecture engagements, defining technology roadmaps, and guiding organizations through digital transformation and cloud modernization programs.',
    },
    {
      role: 'Solutions Architect',
      organization: 'Technology Delivery',
      period: '2013 - 2018',
      summary:
        'Designed and delivered large-scale enterprise systems, establishing integration patterns and architectural standards across multiple business units.',
    },
    {
      role: 'Senior Software Engineer',
      organization: 'Product Engineering',
      period: '2009 - 2013',
      summary:
        'Built and scaled core platform services, laying the technical foundation that later informed enterprise-wide architectural decisions.',
    },
  ],
  projects: [
    {
      name: 'Enterprise Architecture Transformation',
      description:
        'Enterprise architecture modernization using SAP LeanIX, covering capability mapping, application portfolio and architecture governance.',
      technologies: ['SAP LeanIX', 'TOGAF', 'Cloud'],
    },
    {
      name: 'AI-Powered SDLC Automation',
      description:
        'Automated software delivery workflow from requirement to deployment, with AI agents supporting planning, coding, testing and Git integration.',
      technologies: ['Claude Code', 'Jira', 'GitHub', 'MCP'],
    },
  ],
  certifications: [],
  contact: {
    email: 'syedaunshah@outlook.com',
    linkedin: 'https://www.linkedin.com/',
    location: 'Available for remote & on-site engagements',
  },
}
