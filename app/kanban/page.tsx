import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { WakandaBackground } from "@/components/wakanda-background"
import { Navbar } from "@/components/navigation/navbar"

export default async function KanbanPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's projects (for now, get the first project)
  const { data: projects } = await supabase.from("projects").select("*").limit(1)

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-black relative">
        <WakandaBackground />
        <Navbar />
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center text-white max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl font-orbitron">W</span>
            </div>
            <h1 className="text-2xl font-orbitron mb-4 text-purple-300">No Projects Found</h1>
            <p className="text-gray-400 mb-6">Create a project to start using the Kanban board.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Create Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  const project = projects[0]

  // Get tasks for the project
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      assignee:users!tasks_assignee_id_fkey(id, name, email, avatar_url),
      subtasks(*)
    `)
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })

  // Get project users
  const { data: users } = await supabase.from("users").select("*").limit(10)

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <WakandaBackground />
      <Navbar />
      <div className="relative z-10 h-[calc(100vh-4rem)]">
        <KanbanBoard projectId={project.id} initialTasks={tasks || []} users={users || []} />
      </div>
    </div>
  )
}
