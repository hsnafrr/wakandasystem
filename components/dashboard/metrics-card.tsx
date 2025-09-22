"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

interface MetricsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  color: string
  description?: string
}

export function MetricsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color,
  description,
}: MetricsCardProps) {
  const isPositive = trend === "up"
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="bg-black/60 backdrop-blur-xl border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            {change && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  isPositive ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"
                }`}
              >
                {trend !== "neutral" && <TrendIcon className="w-4 h-4" />}
                {change}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
              {value}
            </h3>
            <p className="text-gray-400 text-sm">{title}</p>
            {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
