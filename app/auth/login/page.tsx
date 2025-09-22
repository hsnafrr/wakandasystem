"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { WakandaBackground } from "@/components/wakanda-background"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/kanban")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <WakandaBackground />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card className="bg-black/80 border-gray-800/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold font-orbitron">W</span>
                </div>
                <CardTitle className="text-2xl text-white font-orbitron">Access Wakanda PM</CardTitle>
                <CardDescription className="text-gray-400">Enter your credentials to access the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Accessing..." : "Access System"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-gray-400">Need access? </span>
                    <Link
                      href="/auth/sign-up"
                      className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
                    >
                      Request Authorization
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
