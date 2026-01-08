import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Eye, Zap, Heart } from 'lucide-react'
import { useGlobalStats } from '@/hooks/useDonTrack'
import { formatEther } from 'viem'

export default function HomePage() {
  const { data: stats } = useGlobalStats()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Vos dons, en toute transparence
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              DonTrack révolutionne le don associatif grâce à la blockchain. 
              Suivez l'utilisation réelle de vos dons et soutenez les causes qui vous tiennent à cœur en toute confiance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/campaigns" className="btn bg-white text-primary-600 hover:bg-primary-50 px-6 py-3">
                Voir les campagnes
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/dashboard" className="btn border-2 border-white text-white hover:bg-white/10 px-6 py-3">
                Créer une association
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalAssociations.toString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Associations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalCampaigns.toString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Campagnes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalDonations.toString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">Dons effectués</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-500">
                  {Number(formatEther(stats.totalRaisedAmount || 0n)).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">CELO collectés</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir DonTrack ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une nouvelle façon de donner, transparente et sécurisée
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparence totale</h3>
              <p className="text-gray-600">
                Chaque don et chaque dépense sont enregistrés sur la blockchain. 
                Suivez l'utilisation de vos dons en temps réel.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sécurité garantie</h3>
              <p className="text-gray-600">
                Smart contracts audités et technologie blockchain Celo 
                pour des transactions sécurisées et immuables.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Frais minimes</h3>
              <p className="text-gray-600">
                Grâce à Celo, les frais de transaction sont quasi nuls. 
                Plus de 96% de votre don arrive directement à l'association.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Connectez-vous', desc: 'Utilisez votre wallet Celo (MetaMask, Valora...)' },
              { step: 2, title: 'Choisissez', desc: 'Parcourez les campagnes et trouvez celle qui vous touche' },
              { step: 3, title: 'Donnez', desc: 'Effectuez votre don en quelques clics' },
              { step: 4, title: 'Suivez', desc: 'Visualisez l\'utilisation de vos dons en temps réel' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-400 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à faire la différence ?
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Rejoignez la communauté DonTrack et participez à une nouvelle ère du don associatif.
          </p>
          <Link to="/campaigns" className="btn bg-gray-900 text-white hover:bg-gray-800 px-8 py-3">
            Découvrir les campagnes
          </Link>
        </div>
      </section>
    </div>
  )
}
