import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const app = express()
const PORT = 4001
const JWT_SECRET = 'your_super_secret_jwt_key_change_this_in_production'

// In-memory storage
let users = []
let credentials = []

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    }
    users.push(user)

    const token = generateToken(user.id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user.id)

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' })
  }
})

// Get all credentials
app.get('/credentials', auth, (req, res) => {
  try {
    const userCredentials = credentials.filter(c => c.userId === req.userId)
    res.json({ credentials: userCredentials })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create credential
app.post('/credentials', auth, (req, res) => {
  try {
    const { title, username, password, url } = req.body

    if (!title || !username || !password) {
      return res.status(400).json({ message: 'Please provide title, username and password' })
    }

    const credential = {
      _id: Date.now().toString(),
      userId: req.userId,
      title,
      username,
      password,
      url,
      createdAt: new Date()
    }

    credentials.push(credential)
    res.status(201).json({
      message: 'Credential created successfully',
      credential
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update credential
app.put('/credentials/:id', auth, (req, res) => {
  try {
    const credential = credentials.find(c => c._id === req.params.id)

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' })
    }

    if (credential.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { title, username, password, url } = req.body

    credential.title = title || credential.title
    credential.username = username || credential.username
    credential.password = password || credential.password
    credential.url = url || credential.url
    credential.updatedAt = new Date()

    res.json({
      message: 'Credential updated successfully',
      credential
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete credential
app.delete('/credentials/:id', auth, (req, res) => {
  try {
    const index = credentials.findIndex(c => c._id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ message: 'Credential not found' })
    }

    const credential = credentials[index]
    if (credential.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    credentials.splice(index, 1)
    res.json({ message: 'Credential deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`✅ In-memory database ready`)
})
