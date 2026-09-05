import { ErrorState } from '@/components/ui'

export interface DashboardErrorStateProps {
  onRetry?: () => void
}

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <div className="py-12">
      <ErrorState
        title="Unable to load workspace dashboard"
        description="We encountered an issue retrieving your workspace summary. Please check your connection and try again."
        onRetry={onRetry}
      />
    </div>
  )
}
