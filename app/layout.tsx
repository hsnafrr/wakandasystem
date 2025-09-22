import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Exo_2 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wakanda PM System - Collaborative Project Management",
  description: "Futuristic project management system inspired by Wakanda technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${orbitron.variable} ${exo2.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
