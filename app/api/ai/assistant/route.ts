import { type NextRequest, NextResponse } from "next/server"
import { generateTaskSubtasks, predictTaskCompletion, detectBottlenecks, smartAssignTask } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
  try {
    const { feature, input } = await request.json()

    switch (feature) {
      case "analyze": {
        const subtasks = await generateTaskSubtasks(input)
        return NextResponse.json({ subtasks })
      }

      case "predict": {
        // Parse input for task data or use defaults
        const taskData = {
          description: input,
          priority: "medium",
          assignee: "team member",
          subtasks: 3,
        }
        const hours = await predictTaskCompletion(taskData)
        return NextResponse.json({ hours })
      }

      case "bottleneck": {
        // For demo, create sample project data
        const projectData = {
          tasks: [
            {
              id: "1",
              title: input,
              status: "in_progress",
              assignee: "Tegar Pratama",
              priority: "high",
              due_date: "2025-01-15",
            },
          ],
        }
        const analysis = await detectBottlenecks(projectData)
        return NextResponse.json(analysis)
      }

      case "assign": {
        const teamMembers = [
          { name: "Hasan Aufar", role: "Project Manager", current_workload: 7 },
          { name: "Tegar Pratama", role: "Frontend Developer", current_workload: 5 },
          { name: "Rafi Hidayat", role: "Backend Engineer", current_workload: 6 },
          { name: "Fito Ananda", role: "AI Engineer", current_workload: 4 },
          { name: "Andre Saputra", role: "UI/UX Designer", current_workload: 3 },
        ]
        const assignee = await smartAssignTask(input, teamMembers)
        return NextResponse.json({ assignee })
      }

      default:
        return NextResponse.json({ error: "Unknown feature" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI Assistant API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
