"use client"

import Link from "next/link"
import { WakandaBackground } from "@/components/wakanda-background"
import { WakandaCard } from "@/components/wakanda-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navigation/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <WakandaBackground />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-sans font-bold mb-4 vibranium-text">WAKANDA PM SYSTEM</h1>
          <p className="text-xl text-muted-foreground font-mono">
            Advanced Collaborative Project Management with AI Assistant
          </p>
          <Badge variant="secondary" className="mt-4 neon-text">
            v1.0 - Vibranium Technology
          </Badge>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <WakandaCard title="Kanban Board" description="Drag & drop task management" glowEffect="hologram">
            <div className="space-y-2">
              <div className="h-2 bg-primary/30 rounded"></div>
              <div className="h-2 bg-secondary/30 rounded w-3/4"></div>
              <div className="h-2 bg-accent/30 rounded w-1/2"></div>
            </div>
          </WakandaCard>

          <WakandaCard title="AI Assistant" description="Wakanda AI for smart project insights" glowEffect="vibranium">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-2 bg-primary/50 rounded mb-1"></div>
                <div className="h-2 bg-primary/30 rounded w-2/3"></div>
              </div>
            </div>
          </WakandaCard>

          <WakandaCard
            title="Team Collaboration"
            description="Real-time communication & file sharing"
            glowEffect="hologram"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-background"
                ></div>
              ))}
            </div>
          </WakandaCard>
        </div>

        {/* Team Members */}
        <WakandaCard title="Project Team" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: "Hasan Aufar", role: "Project Manager", tasks: "3/5" },
              { name: "Tegar Pratama", role: "Frontend Developer", tasks: "1/4" },
              { name: "Rafi Hidayat", role: "Backend Engineer", tasks: "1/3" },
              { name: "Fito Ananda", role: "AI Engineer", tasks: "0/2" },
              { name: "Andre Saputra", role: "UI/UX Designer", tasks: "1/2" },
            ].map((member, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-muted/20">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-2"></div>
                <h3 className="font-sans font-semibold text-sm">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {member.tasks} tasks
                </Badge>
              </div>
            ))}
          </div>
        </WakandaCard>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/kanban">
            <Button size="lg" className="vibranium-glow">
              Enter Kanban Board
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="hologram-glow">
              View Analytics Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
