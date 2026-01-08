import { useState, useEffect } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { Search, Filter, Loader2 } from 'lucide-react'
import CampaignCard from '@/components/campaign/CampaignCard'
import { DONTRACK_ABI, DONTRACK_ADDRESS } from '@/lib/contract'
import { Campaign, CampaignStatus } from '@/types'

export default function CampaignsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all')

    // 1. Récupérer les stats globales
    const { data: stats } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getGlobalStats',
    })

    const totalCampaigns = stats ? Number(stats[1]) : 0

    // 2. Préparer les appels pour chaque campagne
    const campaignCalls = Array.from({ length: totalCampaigns }, (_, i) => ({
        address: DONTRACK_ADDRESS.celoSepolia as `0x${string}`,
        abi: DONTRACK_ABI,
        functionName: 'getCampaign' as const,
        args: [BigInt(i)],
    }))

    const { data: campaignsData, isLoading } = useReadContracts({
        contracts: campaignCalls,
        query: { enabled: totalCampaigns > 0 },
    })

    // 3. Préparer les appels pour les associations
    const associationIds = campaignsData
        ?.filter(c => c.status === 'success' && c.result)
        .map(c => (c.result as Campaign).associationId) || []

    const uniqueAssociationIds = [...new Set(associationIds.map(id => id.toString()))]

    const associationCalls = uniqueAssociationIds.map(id => ({
        address: DONTRACK_ADDRESS.celoSepolia as `0x${string}`,
        abi: DONTRACK_ABI,
        functionName: 'getAssociation' as const,
        args: [BigInt(id)],
    }))

    const { data: associationsData } = useReadContracts({
        contracts: associationCalls,
        query: { enabled: uniqueAssociationIds.length > 0 },
    })

    // 4. Créer un map des associations
    const associationsMap: Record<string, string> = {}
    associationsData?.forEach((a, index) => {
        if (a.status === 'success' && a.result) {
            const assoc = a.result as { name: string }
            associationsMap[uniqueAssociationIds[index]] = assoc.name
        }
    })

    // 5. Transformer les données
    const campaigns: Campaign[] = campaignsData
        ?.filter(c => c.status === 'success' && c.result)
        .map(c => c.result as Campaign) || []

    // 6. Filtrer les campagnes
    const filteredCampaigns = campaigns.filter((campaign) => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && campaign.status === CampaignStatus.Active) ||
            (statusFilter === 'completed' && campaign.status === CampaignStatus.Completed)

        return matchesSearch && matchesStatus
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Campagnes</h1>
                <p className="text-gray-600">
                    Découvrez les campagnes en cours et soutenez les causes qui vous tiennent à cœur.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une campagne..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
                        className="input w-auto"
                    >
                        <option value="all">Toutes</option>
                        <option value="active">En cours</option>
                        <option value="completed">Terminées</option>
                    </select>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            )}

            {/* Results count */}
            {!isLoading && (
                <p className="text-sm text-gray-500 mb-6">
                    {filteredCampaigns.length} campagne{filteredCampaigns.length > 1 ? 's' : ''} trouvée{filteredCampaigns.length > 1 ? 's' : ''}
                </p>
            )}

            {/* Campaigns grid */}
            {!isLoading && filteredCampaigns.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id.toString()}
                            campaign={campaign}
                            associationName={associationsMap[campaign.associationId.toString()]}
                        />
                    ))}
                </div>
            ) : !isLoading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Aucune campagne trouvée.</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Créez une association et lancez votre première campagne !
                    </p>
                </div>
            ) : null}
        </div>
    )
}