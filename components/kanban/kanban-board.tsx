"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Task, User as UserType } from "@/lib/types"
import { TaskCard } from "./task-card"
import { CreateTaskDialog } from "./create-task-dialog"
import AIAssistant from "@/components/ai/ai-assistant"

interface KanbanColumn {
  id: string
  title: string
  tasks: Task[]
}

interface KanbanBoardProps {
  projectId: number
  initialTasks?: Task[]
  users?: UserType[]
}

export function KanbanBoard({ projectId, initialTasks = [], users = [] }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in_progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>("todo")

  // Initialize columns with tasks
  useEffect(() => {
    const todoTasks = initialTasks.filter((task) => task.status === "todo")
    const inProgressTasks = initialTasks.filter((task) => task.status === "in_progress")
    const doneTasks = initialTasks.filter((task) => task.status === "done")

    setColumns([
      { id: "todo", title: "To Do", tasks: todoTasks },
      { id: "in_progress", title: "In Progress", tasks: inProgressTasks },
      { id: "done", title: "Done", tasks: doneTasks },
    ])
  }, [initialTasks])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const draggedTask = sourceColumn.tasks.find((task) => task.id.toString() === draggableId)
    if (!draggedTask) return

    // Update task status
    const updatedTask = { ...draggedTask, status: destination.droppableId as Task["status"] }

    // Remove from source column
    const newSourceTasks = sourceColumn.tasks.filter((task) => task.id.toString() !== draggableId)

    // Add to destination column
    const newDestTasks = [...destColumn.tasks]
    newDestTasks.splice(destination.index, 0, updatedTask)

    // Update columns state
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: newSourceTasks }
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: newDestTasks }
        }
        return col
      }),
    )

    // TODO: Update task status in database
    console.log(`[v0] Task ${draggedTask.id} moved from ${source.droppableId} to ${destination.droppableId}`)
  }

  const handleCreateTask = (columnId: string) => {
    setSelectedColumn(columnId)
    setIsCreateDialogOpen(true)
  }

  const handleTaskAnalysis = (analysis: any) => {
    console.log("[v0] AI Task Analysis:", analysis)
    // TODO: Integrate with task creation dialog
  }

  const handleTimePredict = (prediction: any) => {
    console.log("[v0] AI Time Prediction:", prediction)
    // TODO: Update task estimates
  }

  const handleBottleneckDetect = (bottlenecks: any) => {
    console.log("[v0] AI Bottleneck Detection:", bottlenecks)
    // TODO: Show bottleneck alerts
  }

  const handleSmartAssign = (assignment: any) => {
    console.log("[v0] AI Smart Assignment:", assignment)
    // TODO: Auto-assign tasks
  }

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 font-orbitron">Project Command Center</h1>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white font-orbitron">{column.title}</h2>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {column.tasks.length}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCreateTask(column.id)}
                  className="text-purple-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/30"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-3 p-4 rounded-lg border transition-all duration-200
                      ${
                        snapshot.isDraggingOver
                          ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/20"
                          : "bg-black/40 border-gray-800/50"
                      }
                      backdrop-blur-sm
                    `}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              transition-all duration-200
                              ${
                                snapshot.isDragging
                                  ? "rotate-2 scale-105 shadow-2xl shadow-purple-500/30"
                                  : "hover:scale-102"
                              }
                            `}
                          >
                            <TaskCard task={task} users={users} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {column.tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-sm font-medium">No tasks yet</p>
                        <p className="text-xs text-gray-600 mt-1">Drag tasks here or create new ones</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        projectId={projectId}
        defaultStatus={selectedColumn as Task["status"]}
        users={users}
      />

      <AIAssistant
        onTaskAnalysis={handleTaskAnalysis}
        onTimePredict={handleTimePredict}
        onBottleneckDetect={handleBottleneckDetect}
        onSmartAssign={handleSmartAssign}
      />
    </div>
  )
}
