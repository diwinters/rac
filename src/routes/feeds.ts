import {Router} from 'express'
import {getFeeds, addFeed, updateFeed, removeFeed, getFeed, reorderFeeds} from '../store/feeds'

export const feedRouter = Router()

// Get all feeds
feedRouter.get('/', (req, res) => {
  try {
    const feeds = getFeeds().sort((a, b) => a.position - b.position)
    res.json({feeds})
  } catch (error) {
    res.status(500).json({error: 'Failed to get feeds'})
  }
})

// Get single feed
feedRouter.get('/:id', (req, res) => {
  try {
    const {id} = req.params
    const feed = getFeed(id)
    
    if (!feed) {
      return res.status(404).json({error: 'Feed not found'})
    }
    
    res.json({feed})
  } catch (error) {
    res.status(500).json({error: 'Failed to get feed'})
  }
})

// Add new feed
feedRouter.post('/', (req, res) => {
  try {
    const {uri, displayName, description, avatar, isPinned, isMandatory, isEnabled} = req.body
    
    if (!uri || !displayName) {
      return res.status(400).json({error: 'URI and displayName are required'})
    }
    
    const feeds = getFeeds()
    const newFeed = addFeed({
      uri,
      displayName,
      description,
      avatar,
      isPinned: isPinned ?? false,
      isMandatory: isMandatory ?? false,
      position: feeds.length,
      isEnabled: isEnabled ?? true,
    })
    
    res.status(201).json({feed: newFeed})
  } catch (error) {
    res.status(500).json({error: 'Failed to add feed'})
  }
})

// Update feed
feedRouter.put('/:id', (req, res) => {
  try {
    const {id} = req.params
    const updates = req.body
    
    const updated = updateFeed(id, updates)
    
    if (!updated) {
      return res.status(404).json({error: 'Feed not found'})
    }
    
    res.json({feed: updated})
  } catch (error) {
    res.status(500).json({error: 'Failed to update feed'})
  }
})

// Delete feed
feedRouter.delete('/:id', (req, res) => {
  try {
    const {id} = req.params
    const removed = removeFeed(id)
    
    if (!removed) {
      return res.status(404).json({error: 'Feed not found'})
    }
    
    res.json({success: true})
  } catch (error) {
    res.status(500).json({error: 'Failed to remove feed'})
  }
})

// Pin/unpin feed
feedRouter.post('/:id/pin', (req, res) => {
  try {
    const {id} = req.params
    const {isPinned} = req.body
    
    const updated = updateFeed(id, {isPinned: isPinned ?? true})
    
    if (!updated) {
      return res.status(404).json({error: 'Feed not found'})
    }
    
    res.json({feed: updated})
  } catch (error) {
    res.status(500).json({error: 'Failed to update feed'})
  }
})

// Set mandatory
feedRouter.post('/:id/mandatory', (req, res) => {
  try {
    const {id} = req.params
    const {isMandatory} = req.body
    
    const updated = updateFeed(id, {isMandatory: isMandatory ?? true})
    
    if (!updated) {
      return res.status(404).json({error: 'Feed not found'})
    }
    
    res.json({feed: updated})
  } catch (error) {
    res.status(500).json({error: 'Failed to update feed'})
  }
})

// Reorder feeds
feedRouter.post('/reorder', (req, res) => {
  try {
    const {feedIds} = req.body
    
    if (!Array.isArray(feedIds)) {
      return res.status(400).json({error: 'feedIds array is required'})
    }
    
    const feeds = reorderFeeds(feedIds)
    res.json({feeds})
  } catch (error) {
    res.status(500).json({error: 'Failed to reorder feeds'})
  }
})
