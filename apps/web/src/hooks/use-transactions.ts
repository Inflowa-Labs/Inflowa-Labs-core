'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Transaction } from '@inflowa-labs/types'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiClient.getTransactions(),
    select: (response) => response.data,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactionData: Omit<Transaction, 'id' | 'createdAt'>) =>
      apiClient.createTransaction(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
