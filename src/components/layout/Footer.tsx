import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DonTrack</span>
            </div>
            <p className="text-sm max-w-md">
              Plateforme de traçabilité et transparence des dons associatifs sur Celo. 
              Suivez l'utilisation réelle de vos dons grâce à la blockchain.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/campaigns" className="hover:text-white transition-colors">
                  Campagnes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@dontrack.io" className="hover:text-white transition-colors">
                  contact@dontrack.io
                </a>
              </li>
              <li>
                <a 
                  href="https://celoscan.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Voir sur CeloScan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} DonTrack. Tous droits réservés.
          </p>
          <p className="text-sm flex items-center gap-1">
            Propulsé par
            <a 
              href="https://celo.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              Celo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
