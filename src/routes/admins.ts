import {Router} from 'express'
import {getAdmins, addAdmin, removeAdmin, getAdmin} from '../store/admins'
import {Admin} from '../types'

export const adminRouter = Router()

// Get all admins
adminRouter.get('/', (req, res) => {
  try {
    const admins = getAdmins()
    res.json({admins})
  } catch (error) {
    res.status(500).json({error: 'Failed to get admins'})
  }
})

// Get single admin
adminRouter.get('/:did', (req, res) => {
  try {
    const {did} = req.params
    const admin = getAdmin(decodeURIComponent(did))
    
    if (!admin) {
      return res.status(404).json({error: 'Admin not found'})
    }
    
    res.json({admin})
  } catch (error) {
    res.status(500).json({error: 'Failed to get admin'})
  }
})

// Add new admin
adminRouter.post('/', (req, res) => {
  try {
    const {did, handle} = req.body
    
    if (!did) {
      return res.status(400).json({error: 'DID is required'})
    }
    
    // Validate DID format
    if (!did.startsWith('did:')) {
      return res.status(400).json({error: 'Invalid DID format'})
    }
    
    const admin: Admin = {
      did,
      handle,
      addedAt: new Date().toISOString(),
    }
    
    const created = addAdmin(admin)
    res.status(201).json({admin: created})
  } catch (error: any) {
    if (error.message === 'Admin already exists') {
      return res.status(409).json({error: error.message})
    }
    res.status(500).json({error: 'Failed to add admin'})
  }
})

// Remove admin
adminRouter.delete('/:did', (req, res) => {
  try {
    const {did} = req.params
    const removed = removeAdmin(decodeURIComponent(did))
    
    if (!removed) {
      return res.status(404).json({error: 'Admin not found'})
    }
    
    res.json({success: true})
  } catch (error) {
    res.status(500).json({error: 'Failed to remove admin'})
  }
})
