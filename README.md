# DonTrack 🎯

**Plateforme de traçabilité et transparence des dons associatifs sur Celo**

DonTrack permet aux donateurs de suivre l'utilisation réelle de leurs dons grâce à la blockchain. Inspiré de HelloAsso, avec la transparence de la blockchain en plus.

## 🌟 Fonctionnalités

- **Associations** : Inscription, vérification, gestion de profil
- **Campagnes** : Création de collectes avec objectifs et durée
- **Dons** : Donations traçables on-chain avec messages optionnels
- **Transparence** : Suivi des dépenses avec justificatifs IPFS
- **Commission automatique** : 4% sur les cagnottes > 2000 CELO

## 🛠️ Stack Technique

- **Blockchain** : Celo (Alfajores Testnet / Mainnet)
- **Smart Contracts** : Solidity 0.8.24
- **Framework** : Hardhat
- **Librairies** : OpenZeppelin Contracts v5
- **Tests** : Chai + Hardhat Network Helpers

## 📦 Installation

```bash
# Cloner le repo
git clone <repo-url>
cd dontrack

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec votre clé privée
```

## 🚀 Utilisation

### Compiler les contrats
```bash
npm run compile
```

### Lancer les tests
```bash
npm run test

# Avec couverture
npm run test:coverage
```

### Déployer sur Alfajores (Testnet)
```bash
npm run deploy:alfajores
```

### Déployer sur Celo (Mainnet)
```bash
npm run deploy:celo
```

## 📋 Architecture des Contrats

```
contracts/
├── DonTrack.sol              # Contrat principal
├── interfaces/
│   └── IDonTrack.sol         # Interface et types
└── libraries/
    └── DonTrackErrors.sol    # Erreurs personnalisées
```

## 🔐 Sécurité

- ✅ ReentrancyGuard sur les fonctions de paiement
- ✅ Pausable pour les urgences
- ✅ Ownable pour l'administration
- ✅ Custom Errors pour économiser du gas
- ✅ Vérification des associations avant création de campagnes

## 💰 Business Model

| Fonctionnalité | Coût |
|----------------|------|
| Inscription association | 0.1 CELO (testnet) / ~300€ équivalent (mainnet) |
| Commission | 4% si cagnotte > 2000 CELO |
| Dons | Gratuit |

## 🔗 Réseaux

| Réseau | Chain ID | RPC |
|--------|----------|-----|
| Alfajores (Testnet) | 44787 | https://alfajores-forno.celo-testnet.org |
| Celo (Mainnet) | 42220 | https://forno.celo.org |

## 📄 Licence

MIT

---

Développé avec ❤️ par l'équipe DonTrack (Y.WENG, M.DIAO, S.ARIFI)
