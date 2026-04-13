import { API_CONFIG } from '@inflowa-labs/config'
import type { User, Transaction, Portfolio, ApiResponse, PaginatedResponse } from '@inflowa-labs/types'

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<ApiResponse<User[]>>('/api/users')
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Transaction endpoints
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<ApiResponse<Transaction[]>>('/api/transactions')
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<ApiResponse<Transaction>> {
    return this.request<ApiResponse<Transaction>>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    })
  }

  // Portfolio endpoints
  async getPortfolio(): Promise<ApiResponse<Portfolio>> {
    return this.request<ApiResponse<Portfolio>>('/api/portfolio')
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
