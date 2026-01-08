# DonTrack Frontend 🎯

Frontend React pour la plateforme DonTrack - Traçabilité et transparence des dons associatifs sur Celo.

## 🛠️ Stack Technique

- **React 18** + TypeScript
- **Vite** - Build tool ultra rapide
- **TailwindCSS** - Styling utility-first
- **RainbowKit** - Connexion wallet
- **Wagmi v2** - Hooks React pour Ethereum/Celo
- **Viem** - Client TypeScript pour Ethereum
- **React Router** - Navigation

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🔧 Configuration

### 1. WalletConnect Project ID

Créez un projet sur [WalletConnect Cloud](https://cloud.walletconnect.com) et récupérez votre Project ID.

Modifiez `src/lib/wagmi.ts` :
```typescript
projectId: 'VOTRE_PROJECT_ID',
```

### 2. Adresse du Smart Contract

Après avoir déployé le smart contract, mettez à jour l'adresse dans `src/lib/contract.ts` :
```typescript
export const DONTRACK_ADDRESS = {
  alfajores: "0xVOTRE_ADRESSE_ALFAJORES",
  celo: "0xVOTRE_ADRESSE_MAINNET",
} as const;
```

## 📁 Structure

```
src/
├── components/          # Composants réutilisables
│   ├── campaign/       # Composants campagne
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Composants UI génériques
├── hooks/              # Hooks personnalisés
│   └── useDonTrack.ts  # Hooks pour le smart contract
├── lib/                # Configuration
│   ├── contract.ts     # ABI et adresses
│   └── wagmi.ts        # Config Wagmi/RainbowKit
├── pages/              # Pages de l'application
├── types/              # Types TypeScript
└── index.css           # Styles Tailwind
```

## 🚀 Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/campaigns` | Liste des campagnes |
| `/campaign/:id` | Détail d'une campagne |
| `/dashboard` | Dashboard association |
| `/my-donations` | Historique des dons |

## 🎨 Design

- Palette de couleurs inspirée de **Celo** (vert #35D07F, or #FBCC5C)
- Design moderne et épuré
- Responsive (mobile-first)
- Dark mode ready (à implémenter)

## 📱 Wallets supportés

- MetaMask
- Valora (wallet Celo natif)
- WalletConnect
- Coinbase Wallet
- Et autres via RainbowKit

## 🔗 Réseaux

| Réseau | Chain ID | Status |
|--------|----------|--------|
| Celo Alfajores (Testnet) | 44787 | ✅ Supporté |
| Celo Mainnet | 42220 | ✅ Supporté |

## 📄 Licence

MIT

---

Développé avec ❤️ par l'équipe DonTrack
