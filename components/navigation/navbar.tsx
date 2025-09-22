"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Kanban, Users, Settings, Bell, Search, Menu, X, Brain, User, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationsPanel } from "@/components/collaboration/notifications-panel"
import { LogoutButton } from "@/components/auth/logout-button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kanban Board", href: "/kanban", icon: Kanban },
  { name: "AI Assistant", href: "/ai", icon: Brain },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav className="bg-black/95 border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-orbitron">W</span>
                </div>
                <span className="text-white font-orbitron font-bold text-lg">WAKANDA PM</span>
              </Link>

              {/* Desktop navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50",
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Search className="w-4 h-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">3</Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-purple-500/30">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">HA</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border-gray-800/50" align="end">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Hasan Aufar</p>
                      <p className="text-xs text-gray-400">hasan@wakanda.pm</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuItem asChild>
                    <LogoutButton variant="ghost" className="w-full justify-start text-gray-300 hover:text-white" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800/50">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Notifications panel */}
      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
