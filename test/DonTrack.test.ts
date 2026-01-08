import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { DonTrack } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("DonTrack", function () {
  // ============ Fixtures ============

  async function deployDonTrackFixture() {
    const [owner, association1, association2, donor1, donor2] = await ethers.getSigners();

    const registrationFee = ethers.parseEther("0.1");

    const DonTrack = await ethers.getContractFactory("DonTrack");
    const dontrack = await DonTrack.deploy(owner.address, registrationFee);

    return { dontrack, owner, association1, association2, donor1, donor2, registrationFee };
  }

  async function deployWithAssociationFixture() {
    const { dontrack, owner, association1, association2, donor1, donor2, registrationFee } =
      await loadFixture(deployDonTrackFixture);

    // Enregistrer et vérifier une association
    await dontrack.connect(association1).registerAssociation(
      "Croix Rouge",
      "Association humanitaire",
      "ipfs://QmMetadata",
      { value: registrationFee }
    );

    await dontrack.connect(owner).verifyAssociation(1);

    return { dontrack, owner, association1, association2, donor1, donor2, registrationFee };
  }

  async function deployWithCampaignFixture() {
    const { dontrack, owner, association1, association2, donor1, donor2, registrationFee } =
      await loadFixture(deployWithAssociationFixture);

    // Créer une campagne
    const goal = ethers.parseEther("10");
    const duration = 30 * 24 * 60 * 60; // 30 jours

    await dontrack.connect(association1).createCampaign(
      "Aide aux réfugiés",
      "Collecte pour l'aide humanitaire",
      "ipfs://QmCampaignMeta",
      goal,
      duration
    );

    return { dontrack, owner, association1, association2, donor1, donor2, registrationFee, goal, duration };
  }

  // ============ Deployment Tests ============

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { dontrack, owner } = await loadFixture(deployDonTrackFixture);
      expect(await dontrack.owner()).to.equal(owner.address);
    });

    it("Should set the correct registration fee", async function () {
      const { dontrack, registrationFee } = await loadFixture(deployDonTrackFixture);
      expect(await dontrack.registrationFee()).to.equal(registrationFee);
    });

    it("Should have correct constants", async function () {
      const { dontrack } = await loadFixture(deployDonTrackFixture);
      
      expect(await dontrack.COMMISSION_THRESHOLD()).to.equal(ethers.parseEther("2000"));
      expect(await dontrack.COMMISSION_RATE()).to.equal(400);
      expect(await dontrack.BASIS_POINTS()).to.equal(10000);
    });
  });

  // ============ Association Tests ============

  describe("Association Registration", function () {
    it("Should register a new association", async function () {
      const { dontrack, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await expect(
        dontrack.connect(association1).registerAssociation(
          "Croix Rouge",
          "Association humanitaire",
          "ipfs://QmMetadata",
          { value: registrationFee }
        )
      )
        .to.emit(dontrack, "AssociationRegistered")
        .withArgs(1, association1.address, "Croix Rouge");

      const association = await dontrack.getAssociation(1);
      expect(association.name).to.equal("Croix Rouge");
      expect(association.wallet).to.equal(association1.address);
      expect(association.status).to.equal(0); // Pending
    });

    it("Should revert if registration fee is insufficient", async function () {
      const { dontrack, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await expect(
        dontrack.connect(association1).registerAssociation(
          "Test",
          "Description",
          "ipfs://hash",
          { value: registrationFee - 1n }
        )
      ).to.be.revertedWithCustomError(dontrack, "InsufficientRegistrationFee");
    });

    it("Should revert if association already exists", async function () {
      const { dontrack, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await dontrack.connect(association1).registerAssociation(
        "Test",
        "Description",
        "ipfs://hash",
        { value: registrationFee }
      );

      await expect(
        dontrack.connect(association1).registerAssociation(
          "Test 2",
          "Description 2",
          "ipfs://hash2",
          { value: registrationFee }
        )
      ).to.be.revertedWithCustomError(dontrack, "AssociationAlreadyExists");
    });
  });

  describe("Association Verification", function () {
    it("Should verify an association (admin)", async function () {
      const { dontrack, owner, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await dontrack.connect(association1).registerAssociation(
        "Test",
        "Description",
        "ipfs://hash",
        { value: registrationFee }
      );

      await expect(dontrack.connect(owner).verifyAssociation(1))
        .to.emit(dontrack, "AssociationVerified")
        .withArgs(1);

      const association = await dontrack.getAssociation(1);
      expect(association.status).to.equal(1); // Verified
    });

    it("Should revert if non-admin tries to verify", async function () {
      const { dontrack, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await dontrack.connect(association1).registerAssociation(
        "Test",
        "Description",
        "ipfs://hash",
        { value: registrationFee }
      );

      await expect(
        dontrack.connect(association1).verifyAssociation(1)
      ).to.be.revertedWithCustomError(dontrack, "OwnableUnauthorizedAccount");
    });
  });

  // ============ Campaign Tests ============

  describe("Campaign Creation", function () {
    it("Should create a campaign for verified association", async function () {
      const { dontrack, association1 } = await loadFixture(deployWithAssociationFixture);

      const goal = ethers.parseEther("10");
      const duration = 30 * 24 * 60 * 60;

      await expect(
        dontrack.connect(association1).createCampaign(
          "Aide aux réfugiés",
          "Description",
          "ipfs://hash",
          goal,
          duration
        )
      )
        .to.emit(dontrack, "CampaignCreated")
        .withArgs(0, 1, "Aide aux réfugiés", goal);

      const campaign = await dontrack.getCampaign(0);
      expect(campaign.title).to.equal("Aide aux réfugiés");
      expect(campaign.goal).to.equal(goal);
      expect(campaign.status).to.equal(0); // Active
    });

    it("Should revert if association is not verified", async function () {
      const { dontrack, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await dontrack.connect(association1).registerAssociation(
        "Test",
        "Description",
        "ipfs://hash",
        { value: registrationFee }
      );

      await expect(
        dontrack.connect(association1).createCampaign(
          "Campaign",
          "Description",
          "ipfs://hash",
          ethers.parseEther("10"),
          86400
        )
      ).to.be.revertedWithCustomError(dontrack, "AssociationNotVerified");
    });

    it("Should revert if goal is zero", async function () {
      const { dontrack, association1 } = await loadFixture(deployWithAssociationFixture);

      await expect(
        dontrack.connect(association1).createCampaign(
          "Test",
          "Description",
          "ipfs://hash",
          0,
          86400
        )
      ).to.be.revertedWithCustomError(dontrack, "InvalidCampaignGoal");
    });

    it("Should revert if duration is invalid", async function () {
      const { dontrack, association1 } = await loadFixture(deployWithAssociationFixture);

      // Too short
      await expect(
        dontrack.connect(association1).createCampaign(
          "Test",
          "Description",
          "ipfs://hash",
          ethers.parseEther("1"),
          3600 // 1 hour
        )
      ).to.be.revertedWithCustomError(dontrack, "InvalidCampaignDuration");

      // Too long
      await expect(
        dontrack.connect(association1).createCampaign(
          "Test",
          "Description",
          "ipfs://hash",
          ethers.parseEther("1"),
          400 * 24 * 60 * 60 // 400 days
        )
      ).to.be.revertedWithCustomError(dontrack, "InvalidCampaignDuration");
    });
  });

  // ============ Donation Tests ============

  describe("Donations", function () {
    it("Should accept donations", async function () {
      const { dontrack, donor1 } = await loadFixture(deployWithCampaignFixture);

      const donationAmount = ethers.parseEther("1");

      await expect(
        dontrack.connect(donor1).donate(0, "Bon courage!", { value: donationAmount })
      )
        .to.emit(dontrack, "DonationReceived")
        .withArgs(0, 0, donor1.address, donationAmount);

      const donation = await dontrack.getDonation(0);
      expect(donation.amount).to.equal(donationAmount);
      expect(donation.donor).to.equal(donor1.address);
      expect(donation.message).to.equal("Bon courage!");

      const campaign = await dontrack.getCampaign(0);
      expect(campaign.raised).to.equal(donationAmount);
    });

    it("Should track multiple donations", async function () {
      const { dontrack, donor1, donor2 } = await loadFixture(deployWithCampaignFixture);

      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("1") });
      await dontrack.connect(donor2).donate(0, "", { value: ethers.parseEther("2") });
      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("0.5") });

      const campaign = await dontrack.getCampaign(0);
      expect(campaign.raised).to.equal(ethers.parseEther("3.5"));

      const donorHistory = await dontrack.getDonorHistory(donor1.address);
      expect(donorHistory.length).to.equal(2);
    });

    it("Should revert if donation amount is zero", async function () {
      const { dontrack, donor1 } = await loadFixture(deployWithCampaignFixture);

      await expect(
        dontrack.connect(donor1).donate(0, "", { value: 0 })
      ).to.be.revertedWithCustomError(dontrack, "InvalidDonationAmount");
    });

    it("Should revert if campaign has ended", async function () {
      const { dontrack, donor1, duration } = await loadFixture(deployWithCampaignFixture);

      // Avancer le temps après la fin de la campagne
      await time.increase(duration + 1);

      await expect(
        dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(dontrack, "CampaignEnded");
    });
  });

  // ============ Expense Tests ============

  describe("Expenses", function () {
    it("Should record expenses", async function () {
      const { dontrack, association1, donor1 } = await loadFixture(deployWithCampaignFixture);

      // D'abord faire un don
      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("5") });

      await expect(
        dontrack.connect(association1).recordExpense(
          0,
          ethers.parseEther("1"),
          "Achat de matériel médical",
          "ipfs://QmProof"
        )
      )
        .to.emit(dontrack, "ExpenseRecorded")
        .withArgs(0, 0, ethers.parseEther("1"), "Achat de matériel médical");

      const expenses = await dontrack.getCampaignExpenses(0);
      expect(expenses.length).to.equal(1);
      expect(expenses[0].description).to.equal("Achat de matériel médical");
    });

    it("Should revert if non-owner tries to record expense", async function () {
      const { dontrack, donor1 } = await loadFixture(deployWithCampaignFixture);

      await expect(
        dontrack.connect(donor1).recordExpense(
          0,
          ethers.parseEther("1"),
          "Test",
          "ipfs://hash"
        )
      ).to.be.revertedWithCustomError(dontrack, "NotAssociationOwner");
    });
  });

  // ============ Withdrawal Tests ============

  describe("Withdrawals", function () {
    it("Should allow withdrawal without commission (under threshold)", async function () {
      const { dontrack, association1, donor1 } = await loadFixture(deployWithCampaignFixture);

      const donationAmount = ethers.parseEther("5");
      await dontrack.connect(donor1).donate(0, "", { value: donationAmount });

      const balanceBefore = await ethers.provider.getBalance(association1.address);

      await dontrack.connect(association1).withdrawFunds(0, donationAmount);

      const balanceAfter = await ethers.provider.getBalance(association1.address);
      
      // Vérifie que le montant reçu est proche du montant demandé (moins les gas)
      expect(balanceAfter - balanceBefore).to.be.closeTo(
        donationAmount,
        ethers.parseEther("0.01") // Tolérance pour les frais de gas
      );
    });

    it("Should apply commission when above threshold", async function () {
      const { dontrack, association1, donor1, donor2 } = await loadFixture(deployWithCampaignFixture);

      // Faire des dons pour dépasser le seuil de 2000
      const bigDonation = ethers.parseEther("3000");
      await dontrack.connect(donor1).donate(0, "", { value: bigDonation });

      const withdrawAmount = ethers.parseEther("1000");
      
      await expect(
        dontrack.connect(association1).withdrawFunds(0, withdrawAmount)
      ).to.emit(dontrack, "CommissionCollected");

      // Commission = 4% de 1000 = 40
      const expectedCommission = ethers.parseEther("40");
      expect(await dontrack.totalCommissionsCollected()).to.equal(expectedCommission);
    });

    it("Should revert if insufficient funds", async function () {
      const { dontrack, association1, donor1 } = await loadFixture(deployWithCampaignFixture);

      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("1") });

      await expect(
        dontrack.connect(association1).withdrawFunds(0, ethers.parseEther("2"))
      ).to.be.revertedWithCustomError(dontrack, "InsufficientFunds");
    });
  });

  // ============ View Functions Tests ============

  describe("View Functions", function () {
    it("Should return global stats", async function () {
      const { dontrack, donor1 } = await loadFixture(deployWithCampaignFixture);

      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("1") });

      const stats = await dontrack.getGlobalStats();
      expect(stats.totalAssociations).to.equal(1);
      expect(stats.totalCampaigns).to.equal(1);
      expect(stats.totalDonations).to.equal(1);
    });

    it("Should return association by wallet", async function () {
      const { dontrack, association1 } = await loadFixture(deployWithAssociationFixture);

      const associationId = await dontrack.getAssociationByWallet(association1.address);
      expect(associationId).to.equal(1);
    });

    it("Should return campaign available funds", async function () {
      const { dontrack, donor1 } = await loadFixture(deployWithCampaignFixture);

      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("5") });

      const available = await dontrack.getCampaignAvailableFunds(0);
      expect(available).to.equal(ethers.parseEther("5"));
    });
  });

  // ============ Admin Functions Tests ============

  describe("Admin Functions", function () {
    it("Should pause and unpause contract", async function () {
      const { dontrack, owner, association1, registrationFee } = await loadFixture(deployDonTrackFixture);

      await dontrack.connect(owner).pause();

      await expect(
        dontrack.connect(association1).registerAssociation(
          "Test",
          "Desc",
          "ipfs://",
          { value: registrationFee }
        )
      ).to.be.revertedWithCustomError(dontrack, "EnforcedPause");

      await dontrack.connect(owner).unpause();

      await expect(
        dontrack.connect(association1).registerAssociation(
          "Test",
          "Desc",
          "ipfs://",
          { value: registrationFee }
        )
      ).to.emit(dontrack, "AssociationRegistered");
    });

    it("Should allow owner to withdraw commissions", async function () {
      const { dontrack, owner, association1, donor1 } = await loadFixture(deployWithCampaignFixture);

      // Gros don pour dépasser le seuil
      await dontrack.connect(donor1).donate(0, "", { value: ethers.parseEther("3000") });
      
      // Retrait avec commission
      await dontrack.connect(association1).withdrawFunds(0, ethers.parseEther("1000"));

      const commissions = await dontrack.totalCommissionsCollected();
      expect(commissions).to.be.gt(0);

      await dontrack.connect(owner).withdrawCommissions();
      expect(await dontrack.totalCommissionsCollected()).to.equal(0);
    });
  });
});
