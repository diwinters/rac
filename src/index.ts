import express from 'express'
import cors from 'cors'
import {adminRouter} from './routes/admins'
import {feedRouter} from './routes/feeds'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Simple API key auth middleware for admin routes
const API_KEY = process.env.API_KEY || 'change-me-in-production'

app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== API_KEY) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  next()
})

// Routes
app.use('/api/admins', adminRouter)
app.use('/api/feeds', feedRouter)

// Public route to check if a DID is admin (used by the app)
app.get('/public/is-admin/:did', async (req, res) => {
  try {
    const {did} = req.params
    const {getAdmins} = await import('./store/admins')
    const admins = getAdmins()
    const isAdmin = admins.some(a => a.did === did)
    res.json({isAdmin})
  } catch (error) {
    res.status(500).json({error: 'Internal server error'})
  }
})

// Public route to get admin DIDs list (used by the app)
app.get('/public/admin-dids', async (req, res) => {
  try {
    const {getAdmins} = await import('./store/admins')
    const admins = getAdmins()
    res.json({dids: admins.map(a => a.did)})
  } catch (error) {
    res.status(500).json({error: 'Internal server error'})
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({status: 'ok'})
})

app.listen(PORT, () => {
  console.log(`Feed Admin server running on port ${PORT}`)
})
