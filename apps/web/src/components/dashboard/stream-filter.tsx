'use client'

import { useState } from 'react'
import { Button } from '@inflowa-labs/ui'
import { Card, CardContent } from '@inflowa-labs/ui'
import { Input } from '@inflowa-labs/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@inflowa-labs/ui'
import { StreamCategory } from '@inflowa-labs/sdk'

interface StreamFilterProps {
  onFilterChange: (filters: StreamFilters) => void
}

export interface StreamFilters {
  search: string
  category: StreamCategory | 'all'
  status: 'all' | 'active' | 'paused'
  minRate: number
  maxRate: number
  sortBy: 'rate' | 'earnings' | 'startTime' | 'name'
  sortOrder: 'asc' | 'desc'
}

export function StreamFilter({ onFilterChange }: StreamFilterProps) {
  const [filters, setFilters] = useState<StreamFilters>({
    search: '',
    category: 'all',
    status: 'all',
    minRate: 0,
    maxRate: Infinity,
    sortBy: 'rate',
    sortOrder: 'desc',
  })

  const handleFilterChange = (key: keyof StreamFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters: StreamFilters = {
      search: '',
      category: 'all',
      status: 'all',
      minRate: 0,
      maxRate: Infinity,
      sortBy: 'rate',
      sortOrder: 'desc',
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Input
              placeholder="Search streams..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select value={filters.category} onValueChange={(value: StreamCategory | 'all') => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="dividend">Dividend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={filters.status} onValueChange={(value: 'all' | 'active' | 'paused') => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rate Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min Rate"
                value={filters.minRate === 0 ? '' : filters.minRate}
                onChange={(e) => handleFilterChange('minRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max Rate"
                value={filters.maxRate === Infinity ? '' : filters.maxRate}
                onChange={(e) => handleFilterChange('maxRate', parseFloat(e.target.value) || Infinity)}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-2">
            <Select value={filters.sortBy} onValueChange={(value: 'rate' | 'earnings' | 'startTime' | 'name') => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate">Rate</SelectItem>
                <SelectItem value="earnings">Earnings</SelectItem>
                <SelectItem value="startTime">Start Time</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => handleFilterChange('sortOrder', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <Button variant="outline" onClick={resetFilters} className="w-full">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
