"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Task, User } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: number
  defaultStatus: Task["status"]
  users: User[]
}

export function CreateTaskDialog({ isOpen, onClose, projectId, defaultStatus, users }: CreateTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignee_id: "",
    due_date: "",
    estimated_hours: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const taskData = {
        project_id: projectId,
        title: formData.title,
        description: formData.description || null,
        status: defaultStatus,
        priority: formData.priority,
        assignee_id: formData.assignee_id || null,
        created_by: user.id,
        due_date: formData.due_date || null,
        estimated_hours: formData.estimated_hours ? Number.parseInt(formData.estimated_hours) : null,
      }

      const { error } = await supabase.from("tasks").insert([taskData])

      if (error) throw error

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignee_id: "",
        due_date: "",
        estimated_hours: "",
      })
      onClose()

      // TODO: Refresh tasks list
      console.log("[v0] Task created successfully")
    } catch (error) {
      console.error("[v0] Error creating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-orbitron text-purple-300">Create New Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to the {defaultStatus.replace("_", " ")} column
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-300">
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task..."
              rows={3}
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {(["urgent", "high", "medium", "low"] as const).map((priority) => (
                    <SelectItem key={priority} value={priority} className="text-white">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(priority)}`}>
                          {priority.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-300">Assignee</Label>
              <Select
                value={formData.assignee_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, assignee_id: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="text-white">
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-medium text-gray-300">
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_hours" className="text-sm font-medium text-gray-300">
                Estimated Hours
              </Label>
              <Input
                id="estimated_hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="0"
                min="0"
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
