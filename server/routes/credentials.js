import express from 'express'
import Credential from '../models/Credential.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Get all credentials for a user
router.get('/', auth, async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.userId })
    res.json({ credentials })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single credential
router.get('/:id', auth, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' })
    }

    // Check if credential belongs to user
    if (credential.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    res.json({ credential })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create credential
router.post('/', auth, async (req, res) => {
  try {
    const { title, username, password, url } = req.body

    if (!title || !username || !password) {
      return res.status(400).json({ message: 'Please provide title, username and password' })
    }

    const credential = new Credential({
      userId: req.userId,
      title,
      username,
      password,
      url
    })

    await credential.save()
    res.status(201).json({
      message: 'Credential created successfully',
      credential
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update credential
router.put('/:id', auth, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' })
    }

    // Check if credential belongs to user
    if (credential.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { title, username, password, url } = req.body

    credential.title = title || credential.title
    credential.username = username || credential.username
    credential.password = password || credential.password
    credential.url = url || credential.url
    credential.updatedAt = Date.now()

    await credential.save()

    res.json({
      message: 'Credential updated successfully',
      credential
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete credential
router.delete('/:id', auth, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' })
    }

    // Check if credential belongs to user
    if (credential.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Credential.findByIdAndDelete(req.params.id)

    res.json({ message: 'Credential deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
