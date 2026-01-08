import { useParams, Link } from 'react-router-dom'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { ArrowLeft, Clock, Target, Users, ExternalLink, CheckCircle, Loader2, Pause, Play, StopCircle } from 'lucide-react'
import { formatEther } from 'viem'
import DonationForm from '@/components/campaign/DonationForm'
import { DONTRACK_ABI, DONTRACK_ADDRESS } from '@/lib/contract'
import { AssociationStatus, CampaignStatus } from '@/types'

export default function CampaignDetailPage() {
    const { id } = useParams()
    const { address } = useAccount()
    const campaignId = BigInt(id || 0)

    // Charger la campagne
    const { data: campaign, isLoading: loadingCampaign, refetch } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getCampaign',
        args: [campaignId],
    })

    // Charger l'association
    const { data: association } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getAssociation',
        args: campaign ? [campaign.associationId] : undefined,
        query: { enabled: !!campaign },
    })

    // Charger les dons
    const { data: donations } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getCampaignDonations',
        args: [campaignId],
    })

    // Charger les dépenses
    const { data: expenses } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getCampaignExpenses',
        args: [campaignId],
    })

    // Actions campagne
    const { writeContract: doClose, data: closeHash, isPending: isClosing } = useWriteContract()
    const { isLoading: isConfirmingClose, isSuccess: isClosed } = useWaitForTransactionReceipt({ hash: closeHash })

    const { writeContract: doPause, data: pauseHash, isPending: isPausing } = useWriteContract()
    const { isLoading: isConfirmingPause, isSuccess: isPausedSuccess } = useWaitForTransactionReceipt({ hash: pauseHash })

    const { writeContract: doResume, data: resumeHash, isPending: isResuming } = useWriteContract()
    const { isLoading: isConfirmingResume, isSuccess: isResumed } = useWaitForTransactionReceipt({ hash: resumeHash })

    // Vérifier si l'utilisateur est le propriétaire
    const isOwner = address && association && address.toLowerCase() === association.wallet.toLowerCase()

    const handleClose = () => {
        doClose({
            address: DONTRACK_ADDRESS.celoSepolia,
            abi: DONTRACK_ABI,
            functionName: 'closeCampaign',
            args: [campaignId],
        })
    }

    const handlePause = () => {
        doPause({
            address: DONTRACK_ADDRESS.celoSepolia,
            abi: DONTRACK_ABI,
            functionName: 'pauseCampaign',
            args: [campaignId],
        })
    }

    const handleResume = () => {
        doResume({
            address: DONTRACK_ADDRESS.celoSepolia,
            abi: DONTRACK_ABI,
            functionName: 'resumeCampaign',
            args: [campaignId],
        })
    }

    const formatDate = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getStatusBadge = (status: number) => {
        switch (status) {
            case CampaignStatus.Active:
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
            case CampaignStatus.Paused:
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En pause</span>
            case CampaignStatus.Completed:
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Terminée</span>
            case CampaignStatus.Cancelled:
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Annulée</span>
            default:
                return null
        }
    }

    // Loading
    if (loadingCampaign) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        )
    }

    // Campagne non trouvée
    if (!campaign || campaign.goal === 0n) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Campagne non trouvée</h1>
                <Link to="/campaigns" className="btn-primary">
                    Retour aux campagnes
                </Link>
            </div>
        )
    }

    const progress = campaign.goal > 0n
        ? Number((campaign.raised * 100n) / campaign.goal)
        : 0

    const endDate = new Date(Number(campaign.endDate) * 1000)
    const isEnded = endDate < new Date() || campaign.status === CampaignStatus.Completed
    const isPaused = campaign.status === CampaignStatus.Paused
    const isActive = campaign.status === CampaignStatus.Active
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back link */}
            <Link to="/campaigns" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux campagnes
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div className="card">
                        <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <Target className="w-24 h-24 text-white/50" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                {association && (
                                    <div className="flex items-center gap-2 text-sm text-primary-600">
                                        {association.status === AssociationStatus.Verified && (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                        <span className="font-medium">{association.name}</span>
                                        {association.status === AssociationStatus.Verified && (
                                            <span className="text-gray-400">• Association vérifiée</span>
                                        )}
                                    </div>
                                )}
                                {getStatusBadge(campaign.status)}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
                            <p className="text-gray-600">{campaign.description}</p>
                        </div>
                    </div>

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="card p-6">
                            <h2 className="font-semibold text-lg mb-4">Gérer la campagne</h2>
                            <div className="flex flex-wrap gap-3">
                                {isActive && (
                                    <>
                                        <button
                                            onClick={handlePause}
                                            disabled={isPausing || isConfirmingPause}
                                            className="btn bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            {isPausing || isConfirmingPause ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Pause className="w-4 h-4 mr-2" />
                                            )}
                                            Mettre en pause
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            disabled={isClosing || isConfirmingClose}
                                            className="btn bg-red-500 text-white hover:bg-red-600"
                                        >
                                            {isClosing || isConfirmingClose ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <StopCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Clôturer
                                        </button>
                                    </>
                                )}
                                {isPaused && (
                                    <>
                                        <button
                                            onClick={handleResume}
                                            disabled={isResuming || isConfirmingResume}
                                            className="btn bg-green-500 text-white hover:bg-green-600"
                                        >
                                            {isResuming || isConfirmingResume ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Play className="w-4 h-4 mr-2" />
                                            )}
                                            Reprendre
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            disabled={isClosing || isConfirmingClose}
                                            className="btn bg-red-500 text-white hover:bg-red-600"
                                        >
                                            {isClosing || isConfirmingClose ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <StopCircle className="w-4 h-4 mr-2" />
                                            )}
                                            Clôturer
                                        </button>
                                    </>
                                )}
                                {isEnded && (
                                    <p className="text-gray-500">Cette campagne est terminée.</p>
                                )}
                            </div>
                            {(isClosed || isPausedSuccess || isResumed) && (
                                <p className="mt-3 text-sm text-green-600">
                                    ✅ Action effectuée ! Rechargez la page pour voir les changements.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Progress */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-lg mb-4">Progression</h2>
                        <div className="progress-bar h-4 mb-4">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${Math.min(100, progress)}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-2xl font-bold text-primary-600">
                                    {Number(formatEther(campaign.raised)).toFixed(2)} CELO
                                </span>
                                <span className="text-gray-500 ml-2">
                                    sur {Number(formatEther(campaign.goal)).toFixed(0)} CELO
                                </span>
                            </div>
                            <span className="text-lg font-medium">{progress}%</span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {isEnded ? (
                                    <span className="text-red-500 font-medium">Campagne terminée</span>
                                ) : isPaused ? (
                                    <span className="text-yellow-500 font-medium">Campagne en pause</span>
                                ) : (
                                    <span>{daysLeft} jours restants</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>{donations?.length || 0} donateurs</span>
                            </div>
                        </div>
                    </div>

                    {/* Expenses - Transparency */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-lg mb-4">
                            Utilisation des fonds
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                (Traçabilité blockchain)
                            </span>
                        </h2>

                        {expenses && expenses.length > 0 ? (
                            <div className="space-y-4">
                                {expenses.map((expense) => (
                                    <div key={expense.id.toString()} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{expense.description}</p>
                                            <p className="text-sm text-gray-500">{formatDate(expense.timestamp)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                -{Number(formatEther(expense.amount)).toFixed(2)} CELO
                                            </p>
                                            {expense.proofHash && (
                                                <a

                                                href="https://celo-sepolia.blockscout.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                                                >
                                                Voir la preuve
                                                <ExternalLink className="w-3 h-3" />
                                                </a>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Aucune dépense enregistrée pour le moment.
                            </p>
                        )}
                    </div>

                    {/* Recent donations */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-lg mb-4">Derniers dons</h2>

                        {donations && donations.length > 0 ? (
                            <div className="space-y-4">
                                {donations.map((donation) => (
                                    <div key={donation.id.toString()} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {shortenAddress(donation.donor)}
                                            </p>
                                            {donation.message && (
                                                <p className="text-sm text-gray-600 mt-1">"{donation.message}"</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(donation.timestamp)}</p>
                                        </div>
                                        <p className="font-semibold text-primary-600">
                                            +{Number(formatEther(donation.amount)).toFixed(2)} CELO
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Soyez le premier à donner !
                            </p>
                        )}
                    </div>
                </div>

                {/* Sidebar - Donation form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        {isActive && (
                            <DonationForm campaignId={campaign.id} />
                        )}

                        {isPaused && (
                            <div className="card p-6 text-center">
                                <Pause className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                <p className="text-gray-600">Cette campagne est en pause.</p>
                            </div>
                        )}

                        {isEnded && (
                            <div className="card p-6 text-center">
                                <p className="text-gray-600">Cette campagne est terminée.</p>
                                <Link to="/campaigns" className="btn-primary mt-4">
                                    Voir d'autres campagnes
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}