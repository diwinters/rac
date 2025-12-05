import fs from 'fs'
import path from 'path'
import {Admin} from '../types'

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data')
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, {recursive: true})
}

// Initialize admins file if it doesn't exist
if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([], null, 2))
}

export function getAdmins(): Admin[] {
  try {
    const data = fs.readFileSync(ADMINS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveAdmins(admins: Admin[]): void {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2))
}

export function addAdmin(admin: Admin): Admin {
  const admins = getAdmins()
  
  // Check if already exists
  if (admins.some(a => a.did === admin.did)) {
    throw new Error('Admin already exists')
  }
  
  admins.push(admin)
  saveAdmins(admins)
  return admin
}

export function removeAdmin(did: string): boolean {
  const admins = getAdmins()
  const filtered = admins.filter(a => a.did !== did)
  
  if (filtered.length === admins.length) {
    return false // Not found
  }
  
  saveAdmins(filtered)
  return true
}

export function getAdmin(did: string): Admin | undefined {
  const admins = getAdmins()
  return admins.find(a => a.did === did)
}
