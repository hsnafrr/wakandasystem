"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { WakandaBackground } from "@/components/wakanda-background"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push(redirectTo)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push(redirectTo)
      } else if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative">
        <WakandaBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-white font-orbitron">Verifying Access Credentials...</p>
            <p className="text-gray-400 text-sm mt-2">Connecting to Wakanda Security Network</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}
