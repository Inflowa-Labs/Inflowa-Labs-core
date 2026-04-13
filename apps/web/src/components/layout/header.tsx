'use client'

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@inflowa-labs/ui'
import { Input } from '@inflowa-labs/ui'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Search */}
          <div className="flex-1 flex items-center max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search streams, transactions..."
                className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 ml-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Premium Account</p>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
