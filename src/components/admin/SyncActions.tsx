import './admin.css'

type SyncActionsProps = {
  onWebsiteSync: () => void
  onPricingSync: () => void
  isWebsitePending: boolean
  isPricingPending: boolean
  disabled?: boolean
}

export function SyncActions({
  onWebsiteSync,
  onPricingSync,
  isWebsitePending,
  isPricingPending,
  disabled = false,
}: SyncActionsProps) {
  return (
    <div className="admin-actions" role="group" aria-label="Sync actions">
      <button
        type="button"
        onClick={onWebsiteSync}
        disabled={disabled || isWebsitePending || isPricingPending}
        aria-busy={isWebsitePending}
      >
        {isWebsitePending ? 'Starting website sync…' : 'Sync website'}
      </button>
      <button
        type="button"
        className="secondary"
        onClick={onPricingSync}
        disabled={disabled || isWebsitePending || isPricingPending}
        aria-busy={isPricingPending}
      >
        {isPricingPending ? 'Starting pricing sync…' : 'Sync prices'}
      </button>
    </div>
  )
}
