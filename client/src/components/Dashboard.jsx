import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard({ user, onLogout }) {
  const [credentials, setCredentials] = useState([])
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      const response = await axios.get('http://localhost:4001/credentials', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCredentials(response.data.credentials || [])
      setError('')
    } catch (err) {
      setError('Failed to fetch credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCredential = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title || !username || !password) {
      setError('Please fill all required fields')
      return
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:4001/credentials/${editingId}`, {
          title,
          username,
          password,
          url
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Credential updated successfully!')
        setEditingId(null)
      } else {
        await axios.post('http://localhost:4001/credentials', {
          title,
          username,
          password,
          url
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Credential added successfully!')
      }

      setTitle('')
      setUsername('')
      setPassword('')
      setUrl('')
      fetchCredentials()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save credential')
    }
  }

  const handleDeleteCredential = async (id) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      try {
        await axios.delete(`http://localhost:4001/credentials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Credential deleted successfully!')
        fetchCredentials()
      } catch (err) {
        setError('Failed to delete credential')
      }
    }
  }

  const handleEditCredential = (cred) => {
    setTitle(cred.title)
    setUsername(cred.username)
    setPassword(cred.password)
    setUrl(cred.url || '')
    setEditingId(cred._id)
  }

  const handleCancel = () => {
    setTitle('')
    setUsername('')
    setPassword('')
    setUrl('')
    setEditingId(null)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="header">
          <h1>Welcome, {user.name}!</h1>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>

        {loading ? (
          <div className="form-section">
            <p>Loading credentials...</p>
          </div>
        ) : (
          <>
            <div className="form-section">
              <h2>{editingId ? 'Edit Credential' : 'Add New Credential'}</h2>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <form onSubmit={handleAddCredential}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username/Email</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="url">URL (Optional)</label>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div className="actions">
                  <button type="submit">
                    {editingId ? 'Update Credential' : 'Add Credential'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn-small" onClick={handleCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="form-section">
              <h2>Your Credentials ({credentials.length})</h2>
              {credentials.length === 0 ? (
                <p>No credentials saved yet. Add one above!</p>
              ) : (
                <div className="credentials-list">
                  {credentials.map((cred) => (
                    <div key={cred._id} className="credential-item">
                      <div className="credential-title">{cred.title}</div>
                      <div className="credential-content">
                        <strong>Username:</strong> {cred.username}
                      </div>
                      <div className="credential-content">
                        <strong>Password:</strong> {'•'.repeat(cred.password.length)}
                      </div>
                      {cred.url && (
                        <div className="credential-content">
                          <strong>URL:</strong> {cred.url}
                        </div>
                      )}
                      <div className="actions">
                        <button
                          className="btn-small"
                          onClick={() => handleEditCredential(cred)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteCredential(cred._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
