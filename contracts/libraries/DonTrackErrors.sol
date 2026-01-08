// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DonTrackErrors
 * @notice Erreurs personnalisées pour la plateforme DonTrack
 * @dev Utilisation des custom errors pour économiser du gas
 */
library DonTrackErrors {
    // ============ Association Errors ============
    
    /// @notice L'association n'existe pas
    error AssociationNotFound(uint256 associationId);
    
    /// @notice L'association n'est pas vérifiée
    error AssociationNotVerified(uint256 associationId);
    
    /// @notice L'association est suspendue
    error AssociationSuspended(uint256 associationId);
    
    /// @notice L'appelant n'est pas le propriétaire de l'association
    error NotAssociationOwner(address caller, uint256 associationId);
    
    /// @notice Frais d'inscription insuffisants
    error InsufficientRegistrationFee(uint256 sent, uint256 required);
    
    /// @notice L'association existe déjà pour cette adresse
    error AssociationAlreadyExists(address wallet);

    // ============ Campaign Errors ============
    
    /// @notice La campagne n'existe pas
    error CampaignNotFound(uint256 campaignId);
    
    /// @notice La campagne n'est pas active
    error CampaignNotActive(uint256 campaignId);
    
    /// @notice La campagne est terminée
    error CampaignEnded(uint256 campaignId);
    
    /// @notice La campagne n'a pas encore commencé
    error CampaignNotStarted(uint256 campaignId);
    
    /// @notice Objectif de campagne invalide
    error InvalidCampaignGoal(uint256 goal);
    
    /// @notice Durée de campagne invalide
    error InvalidCampaignDuration(uint256 duration);

    // ============ Donation Errors ============
    
    /// @notice Montant du don invalide (zéro)
    error InvalidDonationAmount();
    
    /// @notice Don non trouvé
    error DonationNotFound(uint256 donationId);

    // ============ Withdrawal Errors ============
    
    /// @notice Fonds insuffisants pour le retrait
    error InsufficientFunds(uint256 requested, uint256 available);
    
    /// @notice Montant de retrait invalide
    error InvalidWithdrawalAmount();
    
    /// @notice Le transfert a échoué
    error TransferFailed(address recipient, uint256 amount);

    // ============ Expense Errors ============
    
    /// @notice Montant de dépense invalide
    error InvalidExpenseAmount();
    
    /// @notice Description de dépense vide
    error EmptyExpenseDescription();

    // ============ Access Control Errors ============
    
    /// @notice L'appelant n'est pas admin
    error NotAdmin(address caller);
    
    /// @notice Opération non autorisée
    error Unauthorized(address caller);

}
