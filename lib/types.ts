export const STAGES = [
  { id: 0, label: 'En fabricación',      color: '#f59e0b' },
  { id: 1, label: 'Lista para envío',     color: '#3b82f6' },
  { id: 2, label: 'En logística',         color: '#8b5cf6' },
  { id: 3, label: 'Tránsito marítimo',    color: '#06b6d4' },
  { id: 4, label: 'Próximo a arribar',    color: '#10b981' },
  { id: 5, label: 'En aduana',            color: '#f97316' },
  { id: 6, label: 'Camino al depósito',   color: '#ef4444' },
  { id: 7, label: 'En depósito',          color: '#22c55e' },
]

export type Role = 'maestro' | 'admin' | 'empleado'

export interface ImportItem {
  id: string
  import_id: string
  code: string
  description: string
  quantity: number
  created_at?: string
}

export interface Import {
  id: string
  name: string
  supplier: string
  stage: number
  purchase_date: string
  estimated_arrival?: string
  vessel_name?: string
  container_number?: string
  notes?: string
  created_at?: string
  items?: ImportItem[]
}

export interface AppUser {
  id: string
  email: string
  name: string
  role: Role
  created_at?: string
}
