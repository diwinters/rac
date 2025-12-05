import fs from 'fs'
import path from 'path'
import {Feed} from '../types'

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data')
const FEEDS_FILE = path.join(DATA_DIR, 'feeds.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, {recursive: true})
}

// Initialize feeds file if it doesn't exist
if (!fs.existsSync(FEEDS_FILE)) {
  fs.writeFileSync(FEEDS_FILE, JSON.stringify([], null, 2))
}

export function getFeeds(): Feed[] {
  try {
    const data = fs.readFileSync(FEEDS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveFeeds(feeds: Feed[]): void {
  fs.writeFileSync(FEEDS_FILE, JSON.stringify(feeds, null, 2))
}

export function addFeed(feed: Omit<Feed, 'id' | 'createdAt' | 'updatedAt'>): Feed {
  const feeds = getFeeds()
  
  const newFeed: Feed = {
    ...feed,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  feeds.push(newFeed)
  saveFeeds(feeds)
  return newFeed
}

export function updateFeed(id: string, updates: Partial<Feed>): Feed | null {
  const feeds = getFeeds()
  const index = feeds.findIndex(f => f.id === id)
  
  if (index === -1) {
    return null
  }
  
  feeds[index] = {
    ...feeds[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  saveFeeds(feeds)
  return feeds[index]
}

export function removeFeed(id: string): boolean {
  const feeds = getFeeds()
  const filtered = feeds.filter(f => f.id !== id)
  
  if (filtered.length === feeds.length) {
    return false
  }
  
  saveFeeds(filtered)
  return true
}

export function getFeed(id: string): Feed | undefined {
  return getFeeds().find(f => f.id === id)
}

export function reorderFeeds(feedIds: string[]): Feed[] {
  const feeds = getFeeds()
  
  // Update positions based on the new order
  feedIds.forEach((id, index) => {
    const feed = feeds.find(f => f.id === id)
    if (feed) {
      feed.position = index
      feed.updatedAt = new Date().toISOString()
    }
  })
  
  saveFeeds(feeds)
  return feeds.sort((a, b) => a.position - b.position)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
