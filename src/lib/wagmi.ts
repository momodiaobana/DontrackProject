import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { celo } from 'wagmi/chains';

// Définir Celo Sepolia (pas dans wagmi par défaut)
const celoSepolia = {
    id: 11142220,
    name: 'Celo Sepolia',
    nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    },
    blockExplorers: {
        default: { name: 'Blockscout', url: 'https://celo-sepolia.blockscout.com' },
    },
    testnet: true,
};

export const config = getDefaultConfig({
    appName: 'DonTrack',
    projectId: '5759118f099e9340f9b9bff81f07e7ad',
    chains: [celoSepolia, celo],
    transports: {
        [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org'),
        [celo.id]: http('https://forno.celo.org'),
    },
});

export { celoSepolia };