'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Portfolio } from '@inflowa-labs/types'

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => apiClient.getPortfolio(),
    select: (response) => response.data,
  })
}
