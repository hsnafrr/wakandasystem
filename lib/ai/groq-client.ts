import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export const groqModel = groq("llama-3.1-70b-versatile")

export async function generateTaskSubtasks(taskDescription: string) {
  try {
    const { text } = await generateText({
      model: groqModel,
      system: `You are Shuri, the brilliant AI assistant from Wakanda. Analyze project tasks and break them down into actionable subtasks. 
      Return a JSON array of subtask objects with 'title' and 'estimated_hours' fields. Keep subtasks specific and actionable.`,
      prompt: `Break down this task into 3-5 subtasks: "${taskDescription}"`,
    })

    // Parse the response to extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback if JSON parsing fails
    return [
      { title: "Research and planning", estimated_hours: 2 },
      { title: "Implementation", estimated_hours: 4 },
      { title: "Testing and review", estimated_hours: 1 },
    ]
  } catch (error) {
    console.error("Error generating subtasks:", error)
    return []
  }
}

export async function predictTaskCompletion(taskData: {
  description: string
  priority: string
  assignee: string
  subtasks: number
}) {
  try {
    const { text } = await generateText({
      model: groqModel,
      system: `You are Shuri's AI system analyzing project timelines. Based on task complexity, priority, and team member workload, 
      predict realistic completion times. Return only a number representing estimated hours.`,
      prompt: `Estimate completion time for: 
      Task: ${taskData.description}
      Priority: ${taskData.priority}
      Assignee: ${taskData.assignee}
      Subtasks: ${taskData.subtasks}
      
      Consider: High priority = faster completion, more subtasks = longer time.
      Return only the estimated hours as a number.`,
    })

    const hours = Number.parseInt(text.match(/\d+/)?.[0] || "8")
    return Math.max(1, Math.min(40, hours)) // Clamp between 1-40 hours
  } catch (error) {
    console.error("Error predicting completion:", error)
    return 8 // Default 8 hours
  }
}

export async function detectBottlenecks(projectData: {
  tasks: Array<{
    id: string
    title: string
    status: string
    assignee: string
    priority: string
    due_date: string
  }>
}) {
  try {
    const { text } = await generateText({
      model: groqModel,
      system: `You are Shuri's project analysis AI. Identify potential bottlenecks and risks in project workflows. 
      Return a JSON object with 'bottlenecks' array containing objects with 'type', 'description', and 'severity' fields.`,
      prompt: `Analyze this project data for bottlenecks:
      ${JSON.stringify(projectData.tasks, null, 2)}
      
      Look for: overloaded assignees, missed deadlines, too many high-priority tasks, blocked dependencies.`,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return { bottlenecks: [] }
  } catch (error) {
    console.error("Error detecting bottlenecks:", error)
    return { bottlenecks: [] }
  }
}

export async function smartAssignTask(
  taskDescription: string,
  teamMembers: Array<{
    name: string
    role: string
    current_workload: number
  }>,
) {
  try {
    const { text } = await generateText({
      model: groqModel,
      system: `You are Shuri's team optimization AI. Recommend the best team member for a task based on their role, 
      skills, and current workload. Return only the team member's name.`,
      prompt: `Recommend assignee for: "${taskDescription}"
      
      Team members:
      ${teamMembers.map((m) => `${m.name} - ${m.role} (workload: ${m.current_workload}/10)`).join("\n")}
      
      Consider role relevance and workload balance. Return only the name.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Error with smart assignment:", error)
    return teamMembers[0]?.name || "Unassigned"
  }
}
