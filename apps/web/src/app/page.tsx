import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Dashboard } from '@/components/dashboard/dashboard'

export default function Home() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
}

// Add metadata for better SEO and social sharing
export const metadata = {
  title: 'Inflowa Labs - Personal Income Streams Dashboard',
  description: 'Track your live earnings from all income sources in real-time. Built on Stellar Soroban.',
  keywords: ['income streaming', 'Stellar', 'Soroban', 'DeFi', 'real-time earnings', 'dashboard'],
}
