import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Heart, LayoutDashboard, History, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Campagnes', href: '/campaigns' },
]

export default function Header() {
  const location = useLocation()
  const { isConnected } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DonTrack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isConnected && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/my-donations"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    location.pathname === '/my-donations'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Mes dons
                </Link>
              </>
            )}
          </div>

          {/* Connect Button */}
          <div className="flex items-center gap-4">
            <ConnectButton 
              label="Connexion"
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
            />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium ${
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isConnected && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-600"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/my-donations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-600"
                  >
                    <History className="w-4 h-4" />
                    Mes dons
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
