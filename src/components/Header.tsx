"use client"

import Link from "next/link"
import { useState } from "react"
import { ModeToggle } from "./dark-toggle"
import {
  Laptop,
  Code,
  GraduationCap,
  Box,
  Award,
  Star,
  Image,
  Briefcase,
  X,
  Menu,
  Contact,
  Newspaper
} from "lucide-react"
import { usePathname } from "next/navigation"

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
}
const year: number = new Date().getFullYear()


const navItems: NavItem[] = [
  { href: "/", icon: Laptop, label: "Home", active: true },
  { href: "/projects", icon: Code, label: "Projects" },
  // { href: "/courses", icon: GraduationCap, label: "Courses" },
  { href: "/project-assets", icon: Box, label: "Project Assets" },
  // { href: "/get-certified", icon: Award, label: "Get Certified" },
  { href: "/reviews", icon: Star, label: "Reviews" },
  { href: "/blogs", icon: Newspaper, label: "Blogs" },
  { href: "/contact", icon: Contact, label: "Contact" },
]

const Header = () => {

  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed 
          w-64 
          bg-sidebar text-sidebar-foreground
          border-r border-gray-200 dark:border-gray-800
          flex flex-col 
          z-50 
          h-screen
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              ridoyMolla.
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Close Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =item.href ==='/'?
                          path === '/':
                           path === item.href || path.startsWith(item.href + "/") // optional for nested routes
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
        flex items-center gap-3 px-4 py-3 rounded-lg mb-2
        transition-all duration-200
        ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-sidebar-foreground hover:bg-sidebar-primary/20'
                  }
      `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

        </nav>

        {/* Optional: Footer section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ©Hridoy Molla {year}
          </p>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white shadow-lg hover:shadow-xl transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  )
}

export default Header