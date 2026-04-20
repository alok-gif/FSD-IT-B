import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }


  if (loading) {
    return <div className="container"><p>Loading...</p></div>
  }
  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="auth-container">
          {showRegister ? (
            <Register onSwitchToLogin={() => setShowRegister(false)} setUser={setUser} />
          ) : (
            <Login onSwitchToRegister={() => setShowRegister(true)} setUser={setUser} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
