"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WakandaCardProps {
  children: React.ReactNode
  className?: string
  glowEffect?: "hologram" | "vibranium" | "none"
  title?: string
  description?: string
}

export function WakandaCard({ children, className, glowEffect = "none", title, description }: WakandaCardProps) {
  return (
    <Card
      className={cn(
        "glassmorphism border-border/50 backdrop-blur-md",
        glowEffect === "hologram" && "hologram-glow",
        glowEffect === "vibranium" && "vibranium-glow",
        className,
      )}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="font-sans text-xl neon-text">{title}</CardTitle>}
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
