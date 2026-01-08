import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Heart, Loader2 } from 'lucide-react'
import { useDonate } from '@/hooks/useDonTrack'

interface DonationFormProps {
  campaignId: bigint
  onSuccess?: () => void
}

const presetAmounts = [5, 10, 25, 50, 100]

export default function DonationForm({ campaignId, onSuccess }: DonationFormProps) {
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const { donate, isPending, isSuccess } = useDonate()

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    try {
      await donate({
        campaignId,
        amount,
        message,
      })
      setAmount('')
      setMessage('')
      onSuccess?.()
    } catch (error) {
      console.error('Donation failed:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Faire un don</h3>
        <p className="text-gray-600 mb-4">
          Connectez votre wallet pour faire un don
        </p>
        <ConnectButton label="Connecter mon wallet" />
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4">Faire un don</h3>

      {/* Preset amounts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              amount === preset.toString()
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            {preset} CELO
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mb-4">
        <label className="label">Montant personnalisé (CELO)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="input"
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label className="label">Message (optionnel)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Un mot d'encouragement..."
          rows={3}
          className="input resize-none"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleDonate}
        disabled={!amount || parseFloat(amount) <= 0 || isPending}
        className="btn-primary w-full py-3"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Transaction en cours...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5 mr-2" />
            Donner {amount || '0'} CELO
          </>
        )}
      </button>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Merci pour votre don ! La transaction a été confirmée.
        </div>
      )}
    </div>
  )
}
