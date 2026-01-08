import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Heart, ExternalLink, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DONTRACK_ABI, DONTRACK_ADDRESS } from '@/lib/contract'
import { formatEther } from 'viem'

export default function MyDonationsPage() {
    const { address, isConnected } = useAccount()

    // Charger l'historique des dons
    const { data: donations, isLoading } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getDonorHistory',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    })

    // Récupérer les IDs de campagnes uniques
    const campaignIds = donations
        ? [...new Set(donations.map(d => d.campaignId.toString()))]
        : []

    // Charger les infos des campagnes
    const campaignCalls = campaignIds.map(id => ({
        address: DONTRACK_ADDRESS.celoSepolia as `0x${string}`,
        abi: DONTRACK_ABI,
        functionName: 'getCampaign' as const,
        args: [BigInt(id)],
    }))

    const { data: campaignsData } = useReadContracts({
        contracts: campaignCalls,
        query: { enabled: campaignIds.length > 0 },
    })

    // Créer un map des noms de campagnes
    const campaignNames: Record<string, string> = {}
    campaignsData?.forEach((c, index) => {
        if (c.status === 'success' && c.result) {
            const campaign = c.result as { title: string }
            campaignNames[campaignIds[index]] = campaign.title
        }
    })

    const formatDate = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0n) || 0n

    if (!isConnected) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center py-20">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes dons</h1>
                    <p className="text-gray-600 mb-6">Connectez votre wallet pour voir votre historique de dons.</p>
                    <ConnectButton />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes dons</h1>
                <p className="text-gray-600">Retrouvez l'historique de tous vos dons sur DonTrack.</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{donations?.length || 0}</p>
                            <p className="text-sm text-gray-500">Dons effectués</p>
                        </div>
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-green-600 font-bold">Ⓒ</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{Number(formatEther(totalDonated)).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">CELO donnés</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="card p-12 text-center">
                    <p className="text-gray-500">Chargement...</p>
                </div>
            )}

            {/* Donations list */}
            {!isLoading && donations && donations.length > 0 ? (
                <div className="card divide-y divide-gray-100">
                    {donations.map((donation) => (
                        <div key={donation.id.toString()} className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <Link
                                        to={`/campaign/${donation.campaignId}`}
                                        className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                                    >
                                        {campaignNames[donation.campaignId.toString()] || `Campagne #${donation.campaignId}`}
                                    </Link>
                                    {donation.message && (
                                        <p className="text-sm text-gray-600 mt-1 italic">"{donation.message}"</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                        {formatDate(donation.timestamp)}
                    </span>
                                        <a
                                            href={`https://celo-sepolia.blockscout.com`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-primary-600 hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Voir sur CeloScan
                                        </a>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-primary-600">
                                        {Number(formatEther(donation.amount)).toFixed(2)} CELO
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !isLoading ? (
                <div className="card p-12 text-center">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore fait de don.</p>
                    <Link to="/campaigns" className="btn-primary">
                        Découvrir les campagnes
                    </Link>
                </div>
            ) : null}
        </div>
    )
}