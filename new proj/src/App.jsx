import { useMemo, useState } from 'react'
import './App.css'

const SECTIONS = {
  mcq: {
    title: 'MCQ Tests',
    description:
      'Attempt topic-wise quizzes, track your speed, and improve your conceptual accuracy.',
    points: ['Daily practice sets', 'Timed full-length mocks', 'Negative marking simulation'],
  },
  results: {
    title: 'Results',
    description:
      'Review your scorecards, compare trends, and identify high-impact improvement areas.',
    points: ['Section-wise analytics', 'Percentile and rank snapshots', 'Attempt history and reports'],
  },
  coding: {
    title: 'Coding Test',
    description:
      'Solve coding challenges with constraints similar to placement and competitive rounds.',
    points: ['Beginner to advanced problems', 'Language-wise submissions', 'Execution and memory insights'],
  },
}

function App() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeSection, setActiveSection] = useState('mcq')

  const studentName = useMemo(() => {
    const [name] = credentials.email.split('@')
    if (!name) return 'Student'
    return name
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }, [credentials.email])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    if (!credentials.email.trim() || !credentials.password.trim()) return
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveSection('mcq')
    setCredentials({ email: '', password: '' })
  }

  const section = SECTIONS[activeSection]

  return (
    <main className="app-shell">
      {!isLoggedIn ? (
        <section className="login-card" aria-label="Student login">
          <p className="eyebrow">Academic Portal</p>
          <h1>Student Login</h1>
          <p className="lead">Sign in to access tests, coding rounds, and performance insights.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="student@example.com"
              value={credentials.email}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />

            <button type="submit">Login to Panel</button>
          </form>
        </section>
      ) : (
        <section className="dashboard" aria-label="Student panel">
          <header className="panel-header">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>{studentName}</h2>
            </div>
            <button className="logout" onClick={handleLogout} type="button">
              Logout
            </button>
          </header>

          <div className="panel-layout">
            <nav className="section-nav" aria-label="Student sections">
              {Object.entries(SECTIONS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={key === activeSection ? 'active' : ''}
                  onClick={() => setActiveSection(key)}
                >
                  {value.title}
                </button>
              ))}
            </nav>

            <article className="section-content">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
