export interface Admin {
  did: string
  handle?: string
  addedAt: string
  addedBy?: string
}

export interface Feed {
  id: string
  uri: string
  displayName: string
  description?: string
  avatar?: string
  isPinned: boolean
  isMandatory: boolean
  position: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
