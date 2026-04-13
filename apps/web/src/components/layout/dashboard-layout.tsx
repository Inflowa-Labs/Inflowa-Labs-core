'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <Header />
          
          {/* Page content */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
