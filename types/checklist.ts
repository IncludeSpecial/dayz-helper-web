export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface Checklist {
  id: string
  name: string
  items: ChecklistItem[]
  createdAt: string
}
