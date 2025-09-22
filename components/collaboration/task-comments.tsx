"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"

interface Comment {
  id: number
  content: string
  created_at: string
  user_id: string
  user: User
}

interface TaskCommentsProps {
  taskId: number
  isOpen: boolean
  onClose: () => void
}

export function TaskComments({ taskId, isOpen, onClose }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen && taskId) {
      fetchComments()
    }
  }, [isOpen, taskId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:users(*)
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("comments")
        .insert({
          task_id: taskId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select(`
          *,
          user:users(*)
        `)
        .single()

      if (error) throw error

      setComments((prev) => [...prev, data])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-black/90 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <CardHeader className="border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Task Comments
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Comments List */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Start the conversation!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800/50"
                    >
                      <Avatar className="w-8 h-8 border border-purple-500/30">
                        <AvatarImage src={comment.user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                          {comment.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{comment.user.name}</span>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            {comment.user.role}
                          </Badge>
                          <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Comment Form */}
            <div className="border-t border-gray-800/50 p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Comment
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
