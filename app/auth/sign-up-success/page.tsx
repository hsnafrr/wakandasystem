"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WakandaBackground } from "@/components/wakanda-background"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen relative">
      <WakandaBackground />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <Card className="bg-black/80 border-gray-800/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl text-white font-orbitron">Authorization Requested</CardTitle>
                <CardDescription className="text-gray-400">
                  Your request has been submitted to the Wakanda security council
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Check Your Email</p>
                      <p className="text-xs text-gray-400">We've sent a verification link to confirm your identity</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 space-y-2">
                    <p>
                      <strong className="text-purple-300">Next Steps:</strong>
                    </p>
                    <ol className="text-left space-y-1 text-gray-400">
                      <li>1. Check your email inbox</li>
                      <li>2. Click the verification link</li>
                      <li>3. Wait for security clearance approval</li>
                      <li>4. Access granted upon verification</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Return to Login
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500">
                    Didn't receive an email? Check your spam folder or contact system administrator.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 gap-3 text-center"
            >
              <div className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50">
                <h4 className="text-sm font-medium text-purple-300 mb-1">Vibranium Encryption</h4>
                <p className="text-xs text-gray-400">End-to-end encryption for all communications</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50">
                <h4 className="text-sm font-medium text-blue-300 mb-1">Multi-Factor Authentication</h4>
                <p className="text-xs text-gray-400">Advanced biometric and token-based security</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
