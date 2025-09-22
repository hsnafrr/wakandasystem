"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Upload, Download, Trash2, File, ImageIcon, FileText, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface TaskFile {
  id: number
  file_name: string
  file_url: string
  file_size: number
  uploaded_at: string
  uploaded_by: string
  user: {
    name: string
    avatar_url?: string
  }
}

interface FileSharingProps {
  taskId: number
  isOpen: boolean
  onClose: () => void
}

export function FileSharing({ taskId, isOpen, onClose }: FileSharingProps) {
  const [files, setFiles] = useState<TaskFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen && taskId) {
      fetchFiles()
    }
  }, [isOpen, taskId])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("files")
        .select(`
          *,
          user:users(name, avatar_url)
        `)
        .eq("task_id", taskId)
        .order("uploaded_at", { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // For demo purposes, we'll create a mock file URL
      // In production, you would upload to Supabase Storage or another service
      const mockFileUrl = `/uploads/${file.name}`

      const { data, error } = await supabase
        .from("files")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_url: mockFileUrl,
          file_size: file.size,
          uploaded_by: user.id,
        })
        .select(`
          *,
          user:users(name, avatar_url)
        `)
        .single()

      if (error) throw error

      setFiles((prev) => [data, ...prev])
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ""
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="w-4 h-4" />
    }
    if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return <FileText className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
                <Paperclip className="w-5 h-5 text-purple-400" />
                Task Files
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {/* Upload Section */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-300 mb-3">Drop files here or click to upload</p>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  asChild
                  disabled={uploading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {uploading ? "Uploading..." : "Choose File"}
                  </label>
                </Button>
              </div>
            </div>

            {/* Files List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800/50 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400">
                        {getFileIcon(file.file_name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{file.file_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{formatFileSize(file.file_size)}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">by {file.user.name}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">
                            {new Date(file.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
