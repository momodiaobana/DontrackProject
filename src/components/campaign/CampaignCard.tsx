import { Link } from 'react-router-dom'
import { Clock, Target, Users } from 'lucide-react'
import { Campaign, CampaignStatus } from '@/types'
import { formatEther } from 'viem'

interface CampaignCardProps {
    campaign: Campaign
    associationName?: string
}

export default function CampaignCard({ campaign, associationName }: CampaignCardProps) {
    const goal = campaign.goal || 0n
    const raised = campaign.raised || 0n

    const progress = goal > 0n
        ? Number((raised * 100n) / goal)
        : 0

    const endDate = new Date(Number(campaign.endDate || 0) * 1000)
    const isEnded = endDate < new Date()
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

    return (
        <Link to={`/campaign/${campaign.id}`} className="card group hover:shadow-md transition-shadow">
            {/* Image placeholder */}
            <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Target className="w-16 h-16 text-white/50" />
            </div>

            <div className="p-5">
                {/* Association name */}
                {associationName && (
                    <p className="text-xs text-primary-600 font-medium mb-1">{associationName}</p>
                )}

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {campaign.title || 'Sans titre'}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {campaign.description || 'Pas de description'}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-semibold text-primary-600">
              {Number(formatEther(raised)).toFixed(2)} CELO
            </span>
                        <span className="text-gray-500">
              sur {Number(formatEther(goal)).toFixed(0)} CELO
            </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {isEnded ? (
                            <span className="text-red-500">Terminée</span>
                        ) : (
                            <span>{daysLeft} jours restants</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{progress}% atteint</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}