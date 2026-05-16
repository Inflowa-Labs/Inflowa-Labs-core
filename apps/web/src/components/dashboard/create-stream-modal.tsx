'use client'

import { useState } from 'react'
import { Button } from '@inflowa-labs/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@inflowa-labs/ui'
import { Input } from '@inflowa-labs/ui'
import { Label } from '@inflowa-labs/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@inflowa-labs/ui'
import { StreamCategory } from '@inflowa-labs/sdk'

interface CreateStreamModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateStream: (streamData: CreateStreamFormData) => void
}

export interface CreateStreamFormData {
  recipient: string
  amountPerSecond: number
  asset: string
  category: StreamCategory
  description: string
  endTime?: number
}

export function CreateStreamModal({ isOpen, onClose, onCreateStream }: CreateStreamModalProps) {
  const [formData, setFormData] = useState<CreateStreamFormData>({
    recipient: '',
    amountPerSecond: 0,
    asset: 'XLM',
    category: 'salary',
    description: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateStreamFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStreamFormData, string>> = {}

    if (!formData.recipient) {
      newErrors.recipient = 'Recipient address is required'
    } else if (!/^G[A-Z0-9]{55}$/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid Stellar address format'
    }

    if (formData.amountPerSecond <= 0) {
      newErrors.amountPerSecond = 'Amount must be greater than 0'
    }

    if (!formData.asset) {
      newErrors.asset = 'Asset is required'
    }

    if (!formData.description) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onCreateStream(formData)
      onClose()
      setFormData({
        recipient: '',
        amountPerSecond: 0,
        asset: 'XLM',
        category: 'salary',
        description: '',
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Create New Stream</CardTitle>
          <CardDescription>Set up a new income stream to start earning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="G..."
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className={errors.recipient ? 'border-red-500' : ''}
              />
              {errors.recipient && <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>}
            </div>

            <div>
              <Label htmlFor="amountPerSecond">Amount per Second</Label>
              <Input
                id="amountPerSecond"
                type="number"
                step="0.000001"
                placeholder="0.000001"
                value={formData.amountPerSecond || ''}
                onChange={(e) => setFormData({ ...formData, amountPerSecond: parseFloat(e.target.value) || 0 })}
                className={errors.amountPerSecond ? 'border-red-500' : ''}
              />
              {errors.amountPerSecond && <p className="text-red-500 text-sm mt-1">{errors.amountPerSecond}</p>}
            </div>

            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select value={formData.asset} onValueChange={(value) => setFormData({ ...formData, asset: value })}>
                <SelectTrigger id="asset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XLM">XLM (Stellar)</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="EURC">EURC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value: StreamCategory) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Monthly salary payment"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Stream
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
