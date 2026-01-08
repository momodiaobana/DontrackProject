import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying DonTrack with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Frais d'inscription : 0.1 CELO pour le testnet (représente ~300€ sur mainnet)
  const registrationFee = ethers.parseEther("0.1");

  const DonTrack = await ethers.getContractFactory("DonTrack");
  const dontrack = await DonTrack.deploy(deployer.address, registrationFee);

  await dontrack.waitForDeployment();

  const address = await dontrack.getAddress();
  console.log("DonTrack deployed to:", address);

  // Vérification des paramètres
  console.log("\n--- Contract Parameters ---");
  console.log("Registration Fee:", ethers.formatEther(await dontrack.registrationFee()), "CELO");
  console.log("Commission Threshold:", ethers.formatEther(await dontrack.COMMISSION_THRESHOLD()), "CELO");
  console.log("Commission Rate:", (await dontrack.COMMISSION_RATE()).toString(), "basis points (4%)");

  console.log("\n--- Deployment Complete ---");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Contract Address:", address);
  console.log("\nTo verify on Celoscan:");
  console.log(`npx hardhat verify --network alfajores ${address} ${deployer.address} ${registrationFee}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
