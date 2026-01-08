// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IDonTrack} from "./interfaces/IDonTrack.sol";
import {DonTrackErrors} from "./libraries/DonTrackErrors.sol";

/**
 * @title DonTrack
 * @author DonTrack Team
 * @notice Plateforme de traçabilité et transparence des dons associatifs
 * @dev Contrat principal gérant associations, campagnes, dons et dépenses sur Celo
 */
contract DonTrack is IDonTrack, Ownable, ReentrancyGuard, Pausable {
    // ============ Constants ============

    /// @notice Seuil de commission (2000 cUSD équivalent en wei)
    uint256 public constant COMMISSION_THRESHOLD = 4760 ether;

    /// @notice Taux de commission en basis points (400 = 4%)
    uint256 public constant COMMISSION_RATE = 400;
    
    /// @notice Diviseur pour les basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    /// @notice Durée minimale d'une campagne (1 jour)
    uint256 public constant MIN_CAMPAIGN_DURATION = 1 days;
    
    /// @notice Durée maximale d'une campagne (365 jours)
    uint256 public constant MAX_CAMPAIGN_DURATION = 365 days;

    // ============ State Variables ============

    /// @notice Frais d'inscription pour les associations (300 cUSD équivalent)
    uint256 public registrationFee;
    
    /// @notice Compteur d'associations
    uint256 private _associationCounter;
    
    /// @notice Compteur de campagnes
    uint256 private _campaignCounter;
    
    /// @notice Compteur de dons
    uint256 private _donationCounter;
    
    /// @notice Compteur de dépenses
    uint256 private _expenseCounter;
    
    /// @notice Total des commissions collectées
    uint256 public totalCommissionsCollected;

    /// @notice Total des dons collectés
    uint256 public totalRaised;

    // ============ Mappings ============

    /// @notice Association ID => Association
    mapping(uint256 => Association) private _associations;
    
    /// @notice Wallet => Association ID
    mapping(address => uint256) private _walletToAssociation;
    
    /// @notice Campaign ID => Campaign
    mapping(uint256 => Campaign) private _campaigns;
    
    /// @notice Association ID => Campaign IDs
    mapping(uint256 => uint256[]) private _associationCampaigns;
    
    /// @notice Donation ID => Donation
    mapping(uint256 => Donation) private _donations;
    
    /// @notice Campaign ID => Donation IDs
    mapping(uint256 => uint256[]) private _campaignDonations;
    
    /// @notice Donor => Donation IDs
    mapping(address => uint256[]) private _donorDonations;
    
    /// @notice Expense ID => Expense
    mapping(uint256 => Expense) private _expenses;
    
    /// @notice Campaign ID => Expense IDs
    mapping(uint256 => uint256[]) private _campaignExpenses;
    
    /// @notice Campaign ID => Fonds disponibles (après retraits)
    mapping(uint256 => uint256) private _campaignAvailableFunds;

    // ============ Constructor ============

    /**
     * @notice Initialise le contrat DonTrack
     * @param initialOwner Adresse du propriétaire initial (admin)
     * @param _registrationFee Frais d'inscription initiaux
     */
    constructor(
        address initialOwner,
        uint256 _registrationFee
    ) Ownable(initialOwner) {
        registrationFee = _registrationFee;
    }

    // ============ Modifiers ============

    /// @notice Vérifie que l'association existe
    modifier associationExists(uint256 associationId) {
        if (_associations[associationId].wallet == address(0)) {
            revert DonTrackErrors.AssociationNotFound(associationId);
        }
        _;
    }

    /// @notice Vérifie que l'association est vérifiée
    modifier associationVerified(uint256 associationId) {
        if (_associations[associationId].status != AssociationStatus.Verified) {
            revert DonTrackErrors.AssociationNotVerified(associationId);
        }
        _;
    }

    /// @notice Vérifie que l'appelant est le propriétaire de l'association
    modifier onlyAssociationOwner(uint256 associationId) {
        if (_associations[associationId].wallet != msg.sender) {
            revert DonTrackErrors.NotAssociationOwner(msg.sender, associationId);
        }
        _;
    }

    /// @notice Vérifie que la campagne existe
    modifier campaignExists(uint256 campaignId) {
        if (_campaigns[campaignId].associationId == 0 && campaignId != 0) {
            revert DonTrackErrors.CampaignNotFound(campaignId);
        }
        if (campaignId == 0 && _campaigns[0].startDate == 0) {
            revert DonTrackErrors.CampaignNotFound(campaignId);
        }
        _;
    }

    /// @notice Vérifie que la campagne est active
    modifier campaignActive(uint256 campaignId) {
        Campaign storage campaign = _campaigns[campaignId];
        if (campaign.status != CampaignStatus.Active) {
            revert DonTrackErrors.CampaignNotActive(campaignId);
        }
        if (block.timestamp > campaign.endDate) {
            revert DonTrackErrors.CampaignEnded(campaignId);
        }
        _;
    }

    // ============ External Functions - Association ============

    /**
     * @notice Inscrit une nouvelle association
     * @param name Nom de l'association
     * @param description Description de l'association
     * @param metadata Hash IPFS des métadonnées
     * @return id Identifiant de l'association créée
     */
    function registerAssociation(
        string calldata name,
        string calldata description,
        string calldata metadata
    ) external payable whenNotPaused returns (uint256) {
        if (_walletToAssociation[msg.sender] != 0) {
            revert DonTrackErrors.AssociationAlreadyExists(msg.sender);
        }
        
        if (msg.value < registrationFee) {
            revert DonTrackErrors.InsufficientRegistrationFee(msg.value, registrationFee);
        }

        uint256 newId = ++_associationCounter;
        
        _associations[newId] = Association({
            id: newId,
            wallet: msg.sender,
            name: name,
            description: description,
            metadata: metadata,
            status: AssociationStatus.Pending,
            registeredAt: block.timestamp,
            totalReceived: 0,
            totalWithdrawn: 0
        });
        
        _walletToAssociation[msg.sender] = newId;

        emit AssociationRegistered(newId, msg.sender, name);

        return newId;
    }

    // ============ External Functions - Campaign ============

    /**
     * @notice Crée une nouvelle campagne de collecte
     * @param title Titre de la campagne
     * @param description Description de la campagne
     * @param metadata Hash IPFS des métadonnées
     * @param goal Objectif de collecte en wei
     * @param duration Durée de la campagne en secondes
     * @return id Identifiant de la campagne créée
     */
    function createCampaign(
        string calldata title,
        string calldata description,
        string calldata metadata,
        uint256 goal,
        uint256 duration
    ) external whenNotPaused returns (uint256) {
        uint256 associationId = _walletToAssociation[msg.sender];
        
        if (associationId == 0) {
            revert DonTrackErrors.AssociationNotFound(0);
        }
        if (_associations[associationId].status != AssociationStatus.Verified) {
            revert DonTrackErrors.AssociationNotVerified(associationId);
        }
        if (goal == 0) {
            revert DonTrackErrors.InvalidCampaignGoal(goal);
        }
        if (duration < MIN_CAMPAIGN_DURATION || duration > MAX_CAMPAIGN_DURATION) {
            revert DonTrackErrors.InvalidCampaignDuration(duration);
        }

        uint256 newId = _campaignCounter++;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        _campaigns[newId] = Campaign({
            id: newId,
            associationId: associationId,
            title: title,
            description: description,
            metadata: metadata,
            goal: goal,
            raised: 0,
            startDate: startDate,
            endDate: endDate,
            status: CampaignStatus.Active
        });

        _associationCampaigns[associationId].push(newId);

        emit CampaignCreated(newId, associationId, title, goal);

        return newId;
    }

    // ============ External Functions - Donation ============

    /**
     * @notice Effectue un don à une campagne
     * @param campaignId Identifiant de la campagne
     * @param message Message optionnel du donateur
     * @return id Identifiant du don
     */
    function donate(
        uint256 campaignId,
        string calldata message
    ) 
        external 
        payable 
        whenNotPaused 
        nonReentrant 
        campaignExists(campaignId) 
        campaignActive(campaignId) 
        returns (uint256) 
    {
        if (msg.value == 0) {
            revert DonTrackErrors.InvalidDonationAmount();
        }

        Campaign storage campaign = _campaigns[campaignId];
        uint256 associationId = campaign.associationId;

        uint256 newId = _donationCounter++;

        _donations[newId] = Donation({
            id: newId,
            campaignId: campaignId,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: message
        });

        totalRaised += msg.value;
        campaign.raised += msg.value;
    _campaignAvailableFunds[campaignId] += msg.value;
        _associations[associationId].totalReceived += msg.value;
        
        _campaignDonations[campaignId].push(newId);
        _donorDonations[msg.sender].push(newId);

        emit DonationReceived(newId, campaignId, msg.sender, msg.value);

        return newId;
    }

    // ============ External Functions - Expense ============

    /**
     * @notice Enregistre une dépense pour une campagne
     * @param campaignId Identifiant de la campagne
     * @param amount Montant de la dépense
     * @param description Description de la dépense
     * @param proofHash Hash IPFS du justificatif
     * @return id Identifiant de la dépense
     */
    function recordExpense(
        uint256 campaignId,
        uint256 amount,
        string calldata description,
        string calldata proofHash
    ) 
        external 
        whenNotPaused 
        campaignExists(campaignId) 
        returns (uint256) 
    {
        Campaign storage campaign = _campaigns[campaignId];
        uint256 associationId = campaign.associationId;
        
        if (_associations[associationId].wallet != msg.sender) {
            revert DonTrackErrors.NotAssociationOwner(msg.sender, associationId);
        }
        if (amount == 0) {
            revert DonTrackErrors.InvalidExpenseAmount();
        }
        if (bytes(description).length == 0) {
            revert DonTrackErrors.EmptyExpenseDescription();
        }

        uint256 newId = _expenseCounter++;

        _expenses[newId] = Expense({
            id: newId,
            campaignId: campaignId,
            amount: amount,
            description: description,
            proofHash: proofHash,
            timestamp: block.timestamp
        });

        _campaignExpenses[campaignId].push(newId);

        emit ExpenseRecorded(newId, campaignId, amount, description);

        return newId;
    }

    // ============ External Functions - Withdrawal ============

    /**
     * @notice Retire des fonds d'une campagne
     * @param campaignId Identifiant de la campagne
     * @param amount Montant à retirer
     */
    function withdrawFunds(
        uint256 campaignId,
        uint256 amount
    ) 
        external 
        whenNotPaused 
        nonReentrant 
        campaignExists(campaignId) 
    {
        Campaign storage campaign = _campaigns[campaignId];
        uint256 associationId = campaign.associationId;
        Association storage association = _associations[associationId];
        
        if (association.wallet != msg.sender) {
            revert DonTrackErrors.NotAssociationOwner(msg.sender, associationId);
        }
        if (amount == 0) {
            revert DonTrackErrors.InvalidWithdrawalAmount();
        }
        
        uint256 available = _campaignAvailableFunds[campaignId];
        if (amount > available) {
            revert DonTrackErrors.InsufficientFunds(amount, available);
        }

        // Calcul de la commission si le seuil est atteint
        uint256 commission = 0;
        if (campaign.raised >= COMMISSION_THRESHOLD) {
            commission = (amount * COMMISSION_RATE) / BASIS_POINTS;
        }

        uint256 netAmount = amount - commission;
        
        _campaignAvailableFunds[campaignId] -= amount;
        association.totalWithdrawn += netAmount;
        
        if (commission > 0) {
            totalCommissionsCollected += commission;
            emit CommissionCollected(campaignId, commission);
        }

        (bool success, ) = payable(msg.sender).call{value: netAmount}("");
        if (!success) {
            revert DonTrackErrors.TransferFailed(msg.sender, netAmount);
        }

        emit FundsWithdrawn(associationId, netAmount, msg.sender);
    }

    // ============ External Functions - Admin ============

    /**
     * @notice Vérifie une association (admin only)
     * @param associationId Identifiant de l'association
     */
    function verifyAssociation(
        uint256 associationId
    ) external onlyOwner associationExists(associationId) {
        _associations[associationId].status = AssociationStatus.Verified;
        emit AssociationVerified(associationId);
    }

    /**
     * @notice Suspend une association (admin only)
     * @param associationId Identifiant de l'association
     * @param reason Raison de la suspension
     */
    function suspendAssociation(
        uint256 associationId,
        string calldata reason
    ) external onlyOwner associationExists(associationId) {
        _associations[associationId].status = AssociationStatus.Suspended;
        emit AssociationSuspended(associationId, reason);
    }

    /**
     * @notice Met à jour les frais d'inscription (admin only)
     * @param newFee Nouveaux frais d'inscription
     */
    function setRegistrationFee(uint256 newFee) external onlyOwner {
        registrationFee = newFee;
    }

    /**
     * @notice Retire les commissions collectées (admin only)
     */
    function withdrawCommissions() external onlyOwner nonReentrant {
        uint256 amount = totalCommissionsCollected;
        totalCommissionsCollected = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        if (!success) {
            revert DonTrackErrors.TransferFailed(owner(), amount);
        }
    }

    /**
     * @notice Met le contrat en pause (admin only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Reprend le contrat (admin only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ View Functions ============

    /// @inheritdoc IDonTrack
    function getAssociation(
        uint256 id
    ) external view returns (Association memory) {
        return _associations[id];
    }

    /// @inheritdoc IDonTrack
    function getCampaign(uint256 id) external view returns (Campaign memory) {
        return _campaigns[id];
    }

    /// @inheritdoc IDonTrack
    function getDonation(uint256 id) external view returns (Donation memory) {
        return _donations[id];
    }

    /// @inheritdoc IDonTrack
    function getCampaignDonations(
        uint256 campaignId
    ) external view returns (Donation[] memory) {
        uint256[] storage donationIds = _campaignDonations[campaignId];
        Donation[] memory donations = new Donation[](donationIds.length);
        
        for (uint256 i = 0; i < donationIds.length; i++) {
            donations[i] = _donations[donationIds[i]];
        }
        
        return donations;
    }

    /// @inheritdoc IDonTrack
    function getCampaignExpenses(
        uint256 campaignId
    ) external view returns (Expense[] memory) {
        uint256[] storage expenseIds = _campaignExpenses[campaignId];
        Expense[] memory expenses = new Expense[](expenseIds.length);
        
        for (uint256 i = 0; i < expenseIds.length; i++) {
            expenses[i] = _expenses[expenseIds[i]];
        }
        
        return expenses;
    }

    /// @inheritdoc IDonTrack
    function getDonorHistory(
        address donor
    ) external view returns (Donation[] memory) {
        uint256[] storage donationIds = _donorDonations[donor];
        Donation[] memory donations = new Donation[](donationIds.length);
        
        for (uint256 i = 0; i < donationIds.length; i++) {
            donations[i] = _donations[donationIds[i]];
        }
        
        return donations;
    }

    /**
     * @notice Retourne les campagnes d'une association
     * @param associationId Identifiant de l'association
     * @return campaigns Liste des campagnes
     */
    function getAssociationCampaigns(
        uint256 associationId
    ) external view returns (Campaign[] memory) {
        uint256[] storage campaignIds = _associationCampaigns[associationId];
        Campaign[] memory campaigns = new Campaign[](campaignIds.length);
        
        for (uint256 i = 0; i < campaignIds.length; i++) {
            campaigns[i] = _campaigns[campaignIds[i]];
        }
        
        return campaigns;
    }

    /**
     * @notice Retourne les fonds disponibles d'une campagne
     * @param campaignId Identifiant de la campagne
     * @return available Fonds disponibles en wei
     */
    function getCampaignAvailableFunds(
        uint256 campaignId
    ) external view returns (uint256) {
        return _campaignAvailableFunds[campaignId];
    }

    /**
     * @notice Retourne l'ID d'association pour un wallet
     * @param wallet Adresse du wallet
     * @return associationId ID de l'association (0 si inexistante)
     */
    function getAssociationByWallet(
        address wallet
    ) external view returns (uint256) {
        return _walletToAssociation[wallet];
    }

    /**
     * @notice Retourne les statistiques globales
     * @return totalAssociations Nombre total d'associations
     * @return totalCampaigns Nombre total de campagnes
     * @return totalDonations Nombre total de dons
     * @return totalRaisedAmount Somme des dons collectés
     * @return commissionsCollected Total des commissions
     */
    function getGlobalStats() external view returns (
        uint256 totalAssociations,
        uint256 totalCampaigns,
        uint256 totalDonations,
        uint256 totalRaisedAmount,
        uint256 commissionsCollected
    ) {
        return (
            _associationCounter,
            _campaignCounter,
            _donationCounter,
            totalRaised,
        totalCommissionsCollected
        );
    }


    /**
 * @notice Permet au créateur de clôturer sa campagne
 * @param campaignId ID de la campagne
 */
    function closeCampaign(uint256 campaignId) external whenNotPaused {
        Campaign storage campaign = _campaigns[campaignId];

        if (campaign.goal == 0) revert DonTrackErrors.CampaignNotFound(campaignId);

        Association storage association = _associations[campaign.associationId];
        if (association.wallet != msg.sender) revert DonTrackErrors.NotAssociationOwner(msg.sender, campaign.associationId);

        if (campaign.status != CampaignStatus.Active) revert DonTrackErrors.CampaignNotActive(campaignId);

        campaign.status = CampaignStatus.Completed;

        emit CampaignStatusChanged(campaignId, CampaignStatus.Completed);
    }

/**
 * @notice Permet au créateur de mettre en pause sa campagne
 * @param campaignId ID de la campagne
 */
    function pauseCampaign(uint256 campaignId) external whenNotPaused {
        Campaign storage campaign = _campaigns[campaignId];

        if (campaign.goal == 0) revert DonTrackErrors.CampaignNotFound(campaignId);

        Association storage association = _associations[campaign.associationId];
        if (association.wallet != msg.sender) revert DonTrackErrors.NotAssociationOwner(msg.sender, campaign.associationId);

        if (campaign.status != CampaignStatus.Active) revert DonTrackErrors.CampaignNotActive(campaignId);

        campaign.status = CampaignStatus.Paused;

        emit CampaignStatusChanged(campaignId, CampaignStatus.Paused);
    }

/**
 * @notice Permet au créateur de reprendre sa campagne en pause
 * @param campaignId ID de la campagne
 */
    function resumeCampaign(uint256 campaignId) external whenNotPaused {
        Campaign storage campaign = _campaigns[campaignId];

        if (campaign.goal == 0) revert DonTrackErrors.CampaignNotFound(campaignId);

        Association storage association = _associations[campaign.associationId];
        if (association.wallet != msg.sender) revert DonTrackErrors.NotAssociationOwner(msg.sender, campaign.associationId);

        if (campaign.status != CampaignStatus.Paused) revert DonTrackErrors.CampaignNotActive(campaignId);

        campaign.status = CampaignStatus.Active;

        emit CampaignStatusChanged(campaignId, CampaignStatus.Active);
    }
}
