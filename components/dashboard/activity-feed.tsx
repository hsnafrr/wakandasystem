"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, MessageSquare, Upload, CheckCircle, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  type: "comment" | "upload" | "complete" | "create" | "update"
  timestamp: string
}

interface ActivityFeedProps {
  activities: Activity[]
  limit?: number
}

export function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-400" />
      case "upload":
        return <Upload className="w-4 h-4 text-purple-400" />
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "create":
        return <Plus className="w-4 h-4 text-yellow-400" />
      default:
        return <Zap className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "comment":
        return "border-l-blue-400"
      case "upload":
        return "border-l-purple-400"
      case "complete":
        return "border-l-green-400"
      case "create":
        return "border-l-yellow-400"
      default:
        return "border-l-gray-400"
    }
  }

  const displayedActivities = activities.slice(0, limit)

  return (
    <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-purple-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors border-l-2 ${getActivityColor(activity.type)}`}
            >
              <Avatar className="w-8 h-8 border border-purple-500/30">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                  {activity.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityIcon(activity.type)}
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-white">{activity.user.name}</span> {activity.action}{" "}
                    <span className="font-medium text-purple-300">{activity.target}</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
