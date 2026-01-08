export const DONTRACK_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "initialOwner", "type": "address"},
            {"internalType": "uint256", "name": "_registrationFee", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {"inputs": [], "name": "EnforcedPause", "type": "error"},
    {"inputs": [], "name": "ExpectedPause", "type": "error"},
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {"inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error"},
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "wallet", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
        ],
        "name": "AssociationRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "reason", "type": "string"}
        ],
        "name": "AssociationSuspended",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"}],
        "name": "AssociationVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": true, "internalType": "uint256", "name": "associationId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "goal", "type": "uint256"}
        ],
        "name": "CampaignCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": false, "internalType": "uint8", "name": "status", "type": "uint8"}
        ],
        "name": "CampaignStatusChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "CommissionCollected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "donationId", "type": "uint256"},
            {"indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "donor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "expenseId", "type": "uint256"},
            {"indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "description", "type": "string"}
        ],
        "name": "ExpenseRecorded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "associationId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"}
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "BASIS_POINTS",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "COMMISSION_RATE",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "COMMISSION_THRESHOLD",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_CAMPAIGN_DURATION",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MIN_CAMPAIGN_DURATION",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "metadata", "type": "string"},
            {"internalType": "uint256", "name": "goal", "type": "uint256"},
            {"internalType": "uint256", "name": "duration", "type": "uint256"}
        ],
        "name": "createCampaign",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"internalType": "string", "name": "message", "type": "string"}
        ],
        "name": "donate",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
        "name": "getAssociation",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "address", "name": "wallet", "type": "address"},
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "metadata", "type": "string"},
                    {"internalType": "uint8", "name": "status", "type": "uint8"},
                    {"internalType": "uint256", "name": "registeredAt", "type": "uint256"},
                    {"internalType": "uint256", "name": "totalReceived", "type": "uint256"},
                    {"internalType": "uint256", "name": "totalWithdrawn", "type": "uint256"}
                ],
                "internalType": "struct IDonTrack.Association",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "wallet", "type": "address"}],
        "name": "getAssociationByWallet",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "associationId", "type": "uint256"}],
        "name": "getAssociationCampaigns",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "associationId", "type": "uint256"},
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "metadata", "type": "string"},
                    {"internalType": "uint256", "name": "goal", "type": "uint256"},
                    {"internalType": "uint256", "name": "raised", "type": "uint256"},
                    {"internalType": "uint256", "name": "startDate", "type": "uint256"},
                    {"internalType": "uint256", "name": "endDate", "type": "uint256"},
                    {"internalType": "uint8", "name": "status", "type": "uint8"}
                ],
                "internalType": "struct IDonTrack.Campaign[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
        "name": "getCampaign",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "associationId", "type": "uint256"},
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "metadata", "type": "string"},
                    {"internalType": "uint256", "name": "goal", "type": "uint256"},
                    {"internalType": "uint256", "name": "raised", "type": "uint256"},
                    {"internalType": "uint256", "name": "startDate", "type": "uint256"},
                    {"internalType": "uint256", "name": "endDate", "type": "uint256"},
                    {"internalType": "uint8", "name": "status", "type": "uint8"}
                ],
                "internalType": "struct IDonTrack.Campaign",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "getCampaignAvailableFunds",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "getCampaignDonations",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
                    {"internalType": "address", "name": "donor", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                    {"internalType": "string", "name": "message", "type": "string"}
                ],
                "internalType": "struct IDonTrack.Donation[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "getCampaignExpenses",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "proofHash", "type": "string"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
                ],
                "internalType": "struct IDonTrack.Expense[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
        "name": "getDonation",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
                    {"internalType": "address", "name": "donor", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                    {"internalType": "string", "name": "message", "type": "string"}
                ],
                "internalType": "struct IDonTrack.Donation",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "donor", "type": "address"}],
        "name": "getDonorHistory",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
                    {"internalType": "address", "name": "donor", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                    {"internalType": "string", "name": "message", "type": "string"}
                ],
                "internalType": "struct IDonTrack.Donation[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGlobalStats",
        "outputs": [
            {"internalType": "uint256", "name": "totalAssociations", "type": "uint256"},
            {"internalType": "uint256", "name": "totalCampaigns", "type": "uint256"},
            {"internalType": "uint256", "name": "totalDonations", "type": "uint256"},
            {"internalType": "uint256", "name": "totalRaisedAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "commissionsCollected", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "proofHash", "type": "string"}
        ],
        "name": "recordExpense",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "metadata", "type": "string"}
        ],
        "name": "registerAssociation",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "registrationFee",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "newFee", "type": "uint256"}],
        "name": "setRegistrationFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "associationId", "type": "uint256"},
            {"internalType": "string", "name": "reason", "type": "string"}
        ],
        "name": "suspendAssociation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCommissionsCollected",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalRaised",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "associationId", "type": "uint256"}],
        "name": "verifyAssociation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawCommissions",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "campaignId", "type": "uint256"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "closeCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "pauseCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "campaignId", "type": "uint256"}],
        "name": "resumeCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

] as const;

// Adresse du contrat (à mettre à jour après déploiement)
export const DONTRACK_ADDRESS = {
    celoSepolia: "0x7fAF0873cBe9584c9409a5B68Bcb7f16BAB21146",
    celo: "0x0000000000000000000000000000000000000000",
} as const;
