"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Clock, AlertTriangle, Users, Sparkles, Send, Loader2 } from "lucide-react"

interface AIAssistantProps {
  onTaskAnalysis?: (analysis: any) => void
  onTimePredict?: (prediction: any) => void
  onBottleneckDetect?: (bottlenecks: any) => void
  onSmartAssign?: (assignment: any) => void
}

export default function AIAssistant({
  onTaskAnalysis,
  onTimePredict,
  onBottleneckDetect,
  onSmartAssign,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const aiFeatures = [
    {
      id: "analyze",
      title: "Task Analyzer",
      description: "Break down complex tasks into subtasks",
      icon: Brain,
      color: "from-purple-500 to-blue-500",
    },
    {
      id: "predict",
      title: "Time Prediction",
      description: "Estimate completion times",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "bottleneck",
      title: "Bottleneck Detection",
      description: "Identify project risks and delays",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "assign",
      title: "Smart Assignment",
      description: "Recommend optimal task assignments",
      icon: Users,
      color: "from-green-500 to-teal-500",
    },
  ]

  const handleFeatureSelect = (featureId: string) => {
    setActiveFeature(featureId)
    setResults(null)
    setInput("")
  }

  const handleSubmit = async () => {
    if (!input.trim() || !activeFeature) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: activeFeature,
          input: input.trim(),
        }),
      })

      const result = await response.json()
      setResults(result)

      // Trigger callbacks
      switch (activeFeature) {
        case "analyze":
          onTaskAnalysis?.(result)
          break
        case "predict":
          onTimePredict?.(result)
          break
        case "bottleneck":
          onBottleneckDetect?.(result)
          break
        case "assign":
          onSmartAssign?.(result)
          break
      }
    } catch (error) {
      console.error("AI Assistant error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 border border-purple-400/20"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-black/90 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Shuri AI Assistant
                </CardTitle>
                <p className="text-sm text-gray-400">Advanced Wakanda technology at your service</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {!activeFeature ? (
                  // Feature Selection
                  <div className="grid grid-cols-2 gap-3">
                    {aiFeatures.map((feature) => {
                      const Icon = feature.icon
                      return (
                        <motion.button
                          key={feature.id}
                          onClick={() => handleFeatureSelect(feature.id)}
                          className="p-3 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all duration-200 text-left group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  // Active Feature Interface
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                        {aiFeatures.find((f) => f.id === activeFeature)?.title}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveFeature(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        Back
                      </Button>
                    </div>

                    <Textarea
                      placeholder={getPlaceholderText(activeFeature)}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-500"
                      rows={3}
                    />

                    <Button
                      onClick={handleSubmit}
                      disabled={!input.trim() || loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                      Analyze with AI
                    </Button>

                    {/* Results Display */}
                    {results && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                      >
                        <h4 className="font-semibold text-purple-300 mb-2">AI Analysis Results:</h4>
                        <div className="text-sm text-gray-300">{renderResults(activeFeature, results)}</div>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function getPlaceholderText(feature: string): string {
  switch (feature) {
    case "analyze":
      return "Describe the task you want to break down into subtasks..."
    case "predict":
      return "Describe the task to get time estimation..."
    case "bottleneck":
      return "Describe your project situation for bottleneck analysis..."
    case "assign":
      return "Describe the task to get assignment recommendations..."
    default:
      return "Enter your request..."
  }
}

function renderResults(feature: string, results: any) {
  switch (feature) {
    case "analyze":
      return (
        <div className="space-y-2">
          {results.subtasks?.map((subtask: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
              <span>{subtask.title}</span>
              <Badge variant="secondary">{subtask.estimated_hours}h</Badge>
            </div>
          ))}
        </div>
      )
    case "predict":
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-300">{results.hours}h</div>
          <div className="text-xs text-gray-400">Estimated completion time</div>
        </div>
      )
    case "bottleneck":
      return (
        <div className="space-y-2">
          {results.bottlenecks?.map((bottleneck: any, index: number) => (
            <div key={index} className="p-2 bg-red-900/20 border border-red-500/20 rounded">
              <div className="font-semibold text-red-300">{bottleneck.type}</div>
              <div className="text-sm">{bottleneck.description}</div>
              <Badge variant="destructive" className="mt-1">
                {bottleneck.severity}
              </Badge>
            </div>
          ))}
        </div>
      )
    case "assign":
      return (
        <div className="text-center">
          <div className="text-lg font-semibold text-green-300">{results.assignee}</div>
          <div className="text-xs text-gray-400">Recommended assignee</div>
        </div>
      )
    default:
      return <pre className="text-xs">{JSON.stringify(results, null, 2)}</pre>
  }
}
