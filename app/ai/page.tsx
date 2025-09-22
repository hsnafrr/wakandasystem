"use client"

import { Navbar } from "@/components/navigation/navbar"
import { WakandaBackground } from "@/components/wakanda-background"
import AIAssistant from "@/components/ai/ai-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, AlertTriangle, Users, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"

const aiFeatures = [
  {
    title: "Task Analyzer",
    description: "Break down complex tasks into actionable subtasks with AI-powered analysis",
    icon: Brain,
    color: "from-purple-500 to-blue-500",
    stats: "95% accuracy",
  },
  {
    title: "Time Prediction",
    description: "Get accurate completion time estimates based on historical data and complexity",
    icon: Clock,
    color: "from-blue-500 to-cyan-500",
    stats: "±2 hours precision",
  },
  {
    title: "Bottleneck Detection",
    description: "Identify potential project risks and workflow bottlenecks before they impact delivery",
    icon: AlertTriangle,
    color: "from-orange-500 to-red-500",
    stats: "87% prevention rate",
  },
  {
    title: "Smart Assignment",
    description: "Optimize task assignments based on team skills, workload, and availability",
    icon: Users,
    color: "from-green-500 to-teal-500",
    stats: "40% efficiency boost",
  },
]

export default function AIPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <WakandaBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full flex items-center justify-center mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Shuri AI Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced Wakanda technology powered by artificial intelligence to optimize your project management workflow
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Groq
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Real-time Analysis</Badge>
          </div>
        </motion.div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Usage Instructions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white font-orbitron">How to Use Shuri AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-300">Quick Access</h3>
                  <p className="text-gray-400 text-sm">
                    Click the floating AI button in the bottom-right corner of any page to access Shuri's capabilities
                    instantly.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-300">Natural Language</h3>
                  <p className="text-gray-400 text-sm">
                    Describe your tasks and challenges in plain English. Shuri understands context and provides
                    intelligent recommendations.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-300">Real-time Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    Get instant insights on project bottlenecks, time estimates, and optimal task assignments based on
                    your team's data.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-300">Continuous Learning</h3>
                  <p className="text-gray-400 text-sm">
                    Shuri learns from your project patterns and team performance to provide increasingly accurate
                    predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Assistant Component */}
      <AIAssistant />
    </div>
  )
}
