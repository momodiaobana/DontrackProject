import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Plus, Building2, BarChart3, Wallet, FileText, Loader2 } from 'lucide-react'
import { useAssociationByWallet, useAssociation, useAssociationCampaigns, useRegistrationFee, useRegisterAssociation, useCreateCampaign } from '@/hooks/useDonTrack'
import { formatEther } from 'viem'
import { AssociationStatus } from '@/types'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { data: associationId } = useAssociationByWallet(address)
  const { data: association } = useAssociation(associationId || 0n)
  const { data: campaigns } = useAssociationCampaigns(associationId || 0n)
  const { data: registrationFee } = useRegistrationFee()

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'register'>('overview')

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Association</h1>
          <p className="text-gray-600 mb-6">Connectez votre wallet pour accéder à votre dashboard.</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  const hasAssociation = associationId && associationId > 0n

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {!hasAssociation ? (
        <RegisterAssociationForm registrationFee={registrationFee || 0n} />
      ) : association?.status !== AssociationStatus.Verified ? (
        <PendingVerification association={association} />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'campaigns', label: 'Campagnes', icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'overview' | 'campaigns')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && association && (
            <OverviewTab association={association} campaigns={campaigns || []} />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsTab campaigns={campaigns || []} />
          )}
        </>
      )}
    </div>
  )
}

function RegisterAssociationForm({ registrationFee }: { registrationFee: bigint }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { register, isPending, isSuccess, error } = useRegisterAssociation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({
      name,
      description,
      metadata: '',
      fee: registrationFee,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <div className="text-center mb-8">
          <Building2 className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer votre association</h2>
          <p className="text-gray-600">
            Inscrivez votre association pour commencer à collecter des dons.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Nom de l'association *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: Croix Rouge Française"
              className="input"
            />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Décrivez les activités et la mission de votre association..."
              className="input resize-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Frais d'inscription</span>
              <span className="font-semibold">{formatEther(registrationFee)} CELO</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ces frais servent à vérifier l'authenticité des associations et à maintenir la plateforme.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              Erreur: {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Association créée avec succès ! En attente de vérification.
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !name || !description}
            className="btn-primary w-full py-3"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transaction en cours...
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5 mr-2" />
                Créer mon association
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function PendingVerification({ association }: { association: any }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{association?.name}</h2>
        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
          En attente de vérification
        </div>
        <p className="text-gray-600">
          Votre demande d'inscription est en cours de traitement. 
          Vous serez notifié dès que votre association sera vérifiée.
        </p>
      </div>
    </div>
  )
}

function OverviewTab({ association, campaigns }: { association: any, campaigns: any[] }) {
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.raised || 0n), 0n)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{campaigns.length}</p>
              <p className="text-sm text-gray-500">Campagnes</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Number(formatEther(totalRaised)).toFixed(2)}</p>
              <p className="text-sm text-gray-500">CELO collectés</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Number(formatEther(association?.totalWithdrawn || 0n)).toFixed(2)}</p>
              <p className="text-sm text-gray-500">CELO retirés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Association info */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Informations</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Nom</dt>
            <dd className="font-medium">{association?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Description</dt>
            <dd className="text-gray-700">{association?.description}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Statut</dt>
            <dd>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Vérifiée
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function CampaignsTab({ campaigns }: { campaigns: any[] }) {
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vos campagnes</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle campagne
        </button>
      </div>

      {showCreateForm && <CreateCampaignForm onClose={() => setShowCreateForm(false)} />}

      {campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id.toString()} className="card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{campaign.title}</h3>
                <p className="text-sm text-gray-500">
                  {Number(formatEther(campaign.raised)).toFixed(2)} / {Number(formatEther(campaign.goal)).toFixed(0)} CELO
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  campaign.status === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status === 0 ? 'Active' : 'Terminée'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Vous n'avez pas encore de campagne.
        </div>
      )}
    </div>
  )
}

function CreateCampaignForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [duration, setDuration] = useState('30')
  const { create, isPending, isSuccess, error } = useCreateCampaign()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create({
      title,
      description,
      metadata: '',
      goal,
      duration: parseInt(duration) * 86400, // Convert days to seconds
    })
    if (!error) {
      onClose()
    }
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4">Créer une campagne</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label className="label">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="input resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Objectif (CELO) *</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              min="1"
              className="input"
            />
          </div>
          <div>
            <label className="label">Durée (jours) *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input"
            >
              <option value="7">7 jours</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
              <option value="60">60 jours</option>
              <option value="90">90 jours</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            Erreur: {error.message}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Annuler
          </button>
          <button type="submit" disabled={isPending} className="btn-primary flex-1">
            {isPending ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  )
}
