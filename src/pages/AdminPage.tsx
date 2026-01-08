import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { DONTRACK_ABI, DONTRACK_ADDRESS } from '@/lib/contract'
import { AssociationStatus } from '@/types'

export default function AdminPage() {
    const { address } = useAccount()
    const [associationId, setAssociationId] = useState('')

    // Vérifier si l'utilisateur est l'owner
    const { data: owner } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'owner',
    })

    // Récupérer l'association
    const { data: association, refetch } = useReadContract({
        address: DONTRACK_ADDRESS.celoSepolia,
        abi: DONTRACK_ABI,
        functionName: 'getAssociation',
        args: associationId ? [BigInt(associationId)] : undefined,
        query: { enabled: !!associationId },
    })

    // Vérifier l'association
    const { writeContract: verify, data: verifyHash, isPending: isVerifying } = useWriteContract()
    const { isLoading: isConfirmingVerify, isSuccess: isVerified } = useWaitForTransactionReceipt({ hash: verifyHash })

    // Suspendre l'association
    const { writeContract: suspend, data: suspendHash, isPending: isSuspending } = useWriteContract()
    const { isLoading: isConfirmingSuspend, isSuccess: isSuspended } = useWaitForTransactionReceipt({ hash: suspendHash })

    const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()

    const handleVerify = () => {
        if (!associationId) return
        verify({
            address: DONTRACK_ADDRESS.celoSepolia,
            abi: DONTRACK_ABI,
            functionName: 'verifyAssociation',
            args: [BigInt(associationId)],
        })
    }

    const handleSuspend = () => {
        if (!associationId) return
        suspend({
            address: DONTRACK_ADDRESS.celoSepolia,
            abi: DONTRACK_ABI,
            functionName: 'suspendAssociation',
            args: [BigInt(associationId), 'Suspended by admin'],
        })
    }

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return { text: 'En attente', color: 'bg-yellow-100 text-yellow-800' }
            case 1: return { text: 'Vérifiée', color: 'bg-green-100 text-green-800' }
            case 2: return { text: 'Suspendue', color: 'bg-red-100 text-red-800' }
            case 3: return { text: 'Rejetée', color: 'bg-gray-100 text-gray-800' }
            default: return { text: 'Inconnu', color: 'bg-gray-100 text-gray-800' }
        }
    }

    if (!isOwner) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="card p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
                    <p className="text-gray-600">
                        Seul l'administrateur du contrat peut accéder à cette page.
                    </p>
                    <p className="text-sm text-gray-400 mt-4">
                        Admin: {owner?.toString()}
                    </p>
                    <p className="text-sm text-gray-400">
                        Vous: {address}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-primary-600" />
                <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            </div>

            {/* Recherche d'association */}
            <div className="card p-6 mb-8">
                <h2 className="font-semibold text-lg mb-4">Gérer une association</h2>
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={associationId}
                        onChange={(e) => setAssociationId(e.target.value)}
                        placeholder="ID de l'association (ex: 1)"
                        className="input flex-1"
                        min="1"
                    />
                    <button
                        onClick={() => refetch()}
                        className="btn-primary"
                    >
                        Rechercher
                    </button>
                </div>
            </div>

            {/* Détails de l'association */}
            {association && association.wallet !== '0x0000000000000000000000000000000000000000' && (
                <div className="card p-6">
                    <h2 className="font-semibold text-lg mb-4">Association #{associationId}</h2>

                    <dl className="space-y-4 mb-6">
                        <div>
                            <dt className="text-sm text-gray-500">Nom</dt>
                            <dd className="font-medium">{association.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Description</dt>
                            <dd className="text-gray-700">{association.description}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Wallet</dt>
                            <dd className="font-mono text-sm">{association.wallet}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Statut</dt>
                            <dd>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusText(association.status).color}`}>
                  {getStatusText(association.status).text}
                </span>
                            </dd>
                        </div>
                    </dl>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            onClick={handleVerify}
                            disabled={isVerifying || isConfirmingVerify || association.status === 1}
                            className="btn-primary flex-1"
                        >
                            {isVerifying || isConfirmingVerify ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Vérification...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Vérifier
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSuspend}
                            disabled={isSuspending || isConfirmingSuspend || association.status === 2}
                            className="btn bg-red-500 text-white hover:bg-red-600 flex-1"
                        >
                            {isSuspending || isConfirmingSuspend ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Suspension...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Suspendre
                                </>
                            )}
                        </button>
                    </div>

                    {/* Messages de succès */}
                    {isVerified && (
                        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
                            ✅ Association vérifiée avec succès !
                        </div>
                    )}
                    {isSuspended && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                            ⛔ Association suspendue.
                        </div>
                    )}
                </div>
            )}

            {/* Association non trouvée */}
            {association && association.wallet === '0x0000000000000000000000000000000000000000' && (
                <div className="card p-6 text-center text-gray-500">
                    Aucune association trouvée avec l'ID #{associationId}
                </div>
            )}
        </div>
    )
}