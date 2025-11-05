// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying RecyclingCredits contract with the account:", deployer.address);

  const RecyclingCredits = await ethers.getContractFactory("RecyclingCredits");
  
  // The constructor of RecyclingCredits requires the initial admin's address.
  const recyclingCredits = await RecyclingCredits.deploy(deployer.address);

  await recyclingCredits.waitForDeployment();
  
  const contractAddress = await recyclingCredits.getAddress();
  console.log("✅ RecyclingCredits contract deployed to:", contractAddress);

  console.log("\nTo verify on Fuji, run:");
  console.log(`npx hardhat verify --network fuji ${contractAddress} "${deployer.address}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});