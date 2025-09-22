"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Clock, MessageSquare, Paperclip, CheckCircle2, Circle } from "lucide-react"
import type { Task, User as UserType } from "@/lib/types"
import { useState } from "react"
import { TaskComments } from "@/components/collaboration/task-comments"
import { FileSharing } from "@/components/collaboration/file-sharing"

interface TaskCardProps {
  task: Task
  users: UserType[]
}

export function TaskCard({ task, users }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showFiles, setShowFiles] = useState(false)

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/20"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const assignedUser = users.find((user) => user.id === task.assignee_id)
  const completedSubtasks = task.subtasks?.filter((st) => st.is_completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <>
      <Card className="group bg-black/60 border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className={`mb-2 text-xs ${getPriorityColor(task.priority)} shadow-sm`}>
                {task.priority.toUpperCase()}
              </Badge>

              <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-purple-100 transition-colors">
                {task.title}
              </h3>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {task.description && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{task.description}</p>}

          {totalSubtasks > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-purple-300">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-300"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {task.due_date && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}

              {task.estimated_hours && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Circle className="w-3 h-3" />
                  <span>{task.estimated_hours}h</span>
                </div>
              )}
            </div>

            {assignedUser && (
              <Avatar className="w-6 h-6 border border-purple-500/30 shadow-sm shadow-purple-500/20">
                <AvatarImage src={assignedUser.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-purple-500/20 text-purple-300">
                  {assignedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-purple-300 text-xs h-6 px-2"
            >
              <MessageSquare className="w-3 h-3" />
              <span>0</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFiles(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-purple-300 text-xs h-6 px-2"
            >
              <Paperclip className="w-3 h-3" />
              <span>0</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <TaskComments taskId={task.id} isOpen={showComments} onClose={() => setShowComments(false)} />

      <FileSharing taskId={task.id} isOpen={showFiles} onClose={() => setShowFiles(false)} />
    </>
  )
}
