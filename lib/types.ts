export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  avatar_url?: string
  created_at: string
}

export interface Project {
  id: number
  name: string
  description?: string
  deadline?: string
  created_by: string
  created_at: string
}

export interface Task {
  id: number
  project_id: number
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: "urgent" | "high" | "medium" | "low"
  assignee_id?: string
  created_by: string
  due_date?: string
  estimated_hours?: number
  actual_hours: number
  created_at: string
  updated_at: string
  assignee?: User
  subtasks?: Subtask[]
}

export interface Subtask {
  id: number
  task_id: number
  title: string
  is_completed: boolean
  created_by: string
  created_at: string
}

export interface Comment {
  id: number
  task_id: number
  user_id: string
  content: string
  created_at: string
  user?: User
}

export interface Notification {
  id: number
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}
