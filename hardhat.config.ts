import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "";

const getAccounts = () => {
    if (!PRIVATE_KEY || PRIVATE_KEY === "your_private_key_here") {
        return [];
    }
    const key = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
    return [key];
};

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        // Celo Sepolia (nouveau testnet)
        celoSepolia: {
            url: "https://forno.celo-sepolia.celo-testnet.org",
            chainId: 11142220,
            accounts: getAccounts(),
        },
        // Celo Mainnet
        celo: {
            url: "https://forno.celo.org",
            chainId: 42220,
            accounts: getAccounts(),
        },
    },
    etherscan: {
        apiKey: {
            celoSepolia: CELOSCAN_API_KEY,
            celo: CELOSCAN_API_KEY,
        },
        customChains: [
            {
                network: "celoSepolia",
                chainId: 11142220,
                urls: {
                    apiURL: "https://celo-sepolia.blockscout.com/api",
                    browserURL: "https://celo-sepolia.blockscout.com",
                },
            },
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io",
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;