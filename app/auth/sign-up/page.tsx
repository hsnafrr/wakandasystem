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
import { Shield, UserPlus, Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/kanban`,
          data: {
            name: formData.name,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <WakandaBackground />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <Card className="bg-black/80 border-gray-800/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-orbitron">Join Wakanda PM</CardTitle>
                <CardDescription className="text-gray-400">
                  Request authorization to access the advanced project management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-gray-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a secure password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Requesting Access...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Request Authorization
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">Already have access? </span>
                    <Link
                      href="/auth/login"
                      className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="text-center text-xs text-gray-500 space-y-2">
              <p>By creating an account, you agree to our security protocols.</p>
              <p>All data is encrypted and protected by Wakanda-level security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
