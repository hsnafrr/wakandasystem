"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { WakandaBackground } from "@/components/wakanda-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Activity,
  Zap,
  BarChart3,
  PieChartIcon,
} from "lucide-react"
import { motion } from "framer-motion"

// Mock data for charts
const taskCompletionData = [
  { month: "Jan", completed: 45, pending: 15, overdue: 5 },
  { month: "Feb", completed: 52, pending: 18, overdue: 3 },
  { month: "Mar", completed: 48, pending: 22, overdue: 8 },
  { month: "Apr", completed: 61, pending: 14, overdue: 2 },
  { month: "May", completed: 55, pending: 19, overdue: 6 },
  { month: "Jun", completed: 67, pending: 12, overdue: 4 },
]

const teamProductivityData = [
  { name: "Hasan Aufar", tasks: 23, efficiency: 92 },
  { name: "Tegar Pratama", tasks: 19, efficiency: 88 },
  { name: "Rafi Hidayat", tasks: 21, efficiency: 95 },
  { name: "Fito Ananda", tasks: 17, efficiency: 85 },
  { name: "Andre Saputra", tasks: 15, efficiency: 90 },
]

const projectStatusData = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "In Progress", value: 30, color: "#3b82f6" },
  { name: "Planning", value: 15, color: "#f59e0b" },
  { name: "On Hold", value: 10, color: "#ef4444" },
]

const burndownData = [
  { day: "Day 1", planned: 100, actual: 100 },
  { day: "Day 2", planned: 90, actual: 95 },
  { day: "Day 3", planned: 80, actual: 85 },
  { day: "Day 4", planned: 70, actual: 70 },
  { day: "Day 5", planned: 60, actual: 55 },
  { day: "Day 6", planned: 50, actual: 45 },
  { day: "Day 7", planned: 40, actual: 35 },
]

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  const kpiData = [
    {
      title: "Total Tasks",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Team Members",
      value: "5",
      change: "0%",
      trend: "neutral",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Avg. Completion Time",
      value: "3.2d",
      change: "-8%",
      trend: "up",
      icon: Clock,
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Overdue Tasks",
      value: "4",
      change: "-25%",
      trend: "up",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <WakandaBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Project Analytics Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Real-time insights into your Wakanda projects</p>
            </div>
            <div className="flex items-center gap-2">
              {["week", "month", "quarter"].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={
                    selectedTimeframe === timeframe
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "border-gray-600 text-gray-300 hover:text-white"
                  }
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            const isPositive = kpi.trend === "up"
            const TrendIcon = isPositive ? TrendingUp : TrendingDown

            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${kpi.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {kpi.change}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
                      <p className="text-gray-400 text-sm">{kpi.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Completion Trends */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Task Completion Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: { label: "Completed", color: "#10b981" },
                    pending: { label: "Pending", color: "#3b82f6" },
                    overdue: { label: "Overdue", color: "#ef4444" },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="overdue" fill="var(--color-overdue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Status Distribution */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: { label: "Completed", color: "#10b981" },
                    inProgress: { label: "In Progress", color: "#3b82f6" },
                    planning: { label: "Planning", color: "#f59e0b" },
                    onHold: { label: "On Hold", color: "#ef4444" },
                  }}
                  className="h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {projectStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-300">{item.name}</span>
                      <span className="text-sm font-semibold text-white ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Team Performance & Burndown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Team Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamProductivityData.map((member, index) => (
                    <div key={member.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{member.name}</h4>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {member.tasks} tasks
                            </Badge>
                            <span className="text-sm font-semibold text-purple-300">{member.efficiency}%</span>
                          </div>
                        </div>
                        <Progress value={member.efficiency} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sprint Burndown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Sprint Burndown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    planned: { label: "Planned", color: "#6b7280" },
                    actual: { label: "Actual", color: "#8b5cf6" },
                  }}
                  className="h-[200px]"
                >
                  <AreaChart data={burndownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      stroke="var(--color-planned)"
                      fill="var(--color-planned)"
                      fillOpacity={0.2}
                      strokeDasharray="5 5"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--color-actual)"
                      fill="var(--color-actual)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sprint Progress</span>
                    <span className="text-white font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>3 days remaining</span>
                    <span>On track</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-purple-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "Tegar Pratama",
                    action: "completed task",
                    item: "User Authentication System",
                    time: "2 minutes ago",
                    type: "success",
                  },
                  {
                    user: "Rafi Hidayat",
                    action: "updated",
                    item: "API Documentation",
                    time: "15 minutes ago",
                    type: "info",
                  },
                  {
                    user: "Fito Ananda",
                    action: "commented on",
                    item: "AI Model Training",
                    time: "1 hour ago",
                    type: "comment",
                  },
                  {
                    user: "Andre Saputra",
                    action: "uploaded file to",
                    item: "Design System",
                    time: "2 hours ago",
                    type: "upload",
                  },
                  {
                    user: "Hasan Aufar",
                    action: "created new task",
                    item: "Sprint Planning Meeting",
                    time: "3 hours ago",
                    type: "create",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : activity.type === "info"
                            ? "bg-blue-400"
                            : activity.type === "comment"
                              ? "bg-yellow-400"
                              : activity.type === "upload"
                                ? "bg-purple-400"
                                : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-white">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium text-purple-300">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
