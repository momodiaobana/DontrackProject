// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IDonTrack
 * @notice Interface principale pour la plateforme DonTrack
 * @dev Définit les fonctions essentielles pour la gestion des dons
 */
interface IDonTrack {
    // ============ Enums ============

    enum AssociationStatus {
        Pending,
        Verified,
        Suspended,
        Rejected
    }

    enum CampaignStatus {
        Active,
        Paused,
        Completed,
        Cancelled
    }

    // ============ Structs ============

    struct Association {
        uint256 id;
        address wallet;
        string name;
        string description;
        string metadata; // IPFS hash pour infos supplémentaires
        AssociationStatus status;
        uint256 registeredAt;
        uint256 totalReceived;
        uint256 totalWithdrawn;
    }

    struct Campaign {
        uint256 id;
        uint256 associationId;
        string title;
        string description;
        string metadata;
        uint256 goal;
        uint256 raised;
        uint256 startDate;
        uint256 endDate;
        CampaignStatus status;
    }

    struct Donation {
        uint256 id;
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct Expense {
        uint256 id;
        uint256 campaignId;
        uint256 amount;
        string description;
        string proofHash; // IPFS hash pour justificatifs
        uint256 timestamp;
    }

    // ============ Events ============

    event AssociationRegistered(
        uint256 indexed id,
        address indexed wallet,
        string name
    );
    
    event AssociationVerified(uint256 indexed id);
    
    event AssociationSuspended(uint256 indexed id, string reason);
    
    event CampaignCreated(
        uint256 indexed id,
        uint256 indexed associationId,
        string title,
        uint256 goal
    );
    
    event CampaignStatusChanged(
        uint256 indexed id,
        CampaignStatus status
    );
    
    event DonationReceived(
        uint256 indexed donationId,
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    
    event ExpenseRecorded(
        uint256 indexed expenseId,
        uint256 indexed campaignId,
        uint256 amount,
        string description
    );
    
    event FundsWithdrawn(
        uint256 indexed associationId,
        uint256 amount,
        address indexed recipient
    );
    
    event CommissionCollected(
        uint256 indexed campaignId,
        uint256 amount
    );

    // ============ Functions ============

    function registerAssociation(
        string calldata name,
        string calldata description,
        string calldata metadata
    ) external payable returns (uint256);

    function createCampaign(
        string calldata title,
        string calldata description,
        string calldata metadata,
        uint256 goal,
        uint256 duration
    ) external returns (uint256);

    function donate(
        uint256 campaignId,
        string calldata message
    ) external payable returns (uint256);

    function recordExpense(
        uint256 campaignId,
        uint256 amount,
        string calldata description,
        string calldata proofHash
    ) external returns (uint256);

    function withdrawFunds(uint256 campaignId, uint256 amount) external;

    function getAssociation(uint256 id) external view returns (Association memory);
    
    function getCampaign(uint256 id) external view returns (Campaign memory);
    
    function getDonation(uint256 id) external view returns (Donation memory);
    
    function getCampaignDonations(uint256 campaignId) external view returns (Donation[] memory);
    
    function getCampaignExpenses(uint256 campaignId) external view returns (Expense[] memory);
    
    function getDonorHistory(address donor) external view returns (Donation[] memory);
}
