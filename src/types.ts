export interface Admin {
  did: string
  handle?: string
  addedAt: string
  addedBy?: string
}

export interface Feed {
  id: string
  name: string
  icon: string // Icon name or URL
  isPinned: boolean
  position: number
  createdAt: string
  updatedAt: string
}
