// scripts/setup.ts
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("--- E-co.lab Recycling Credits Boilerplate Setup ---");
  console.log("This script will generate a deployment script for your project.");

  const contractName = "RecyclingCredits"; // The contract we are deploying
  const network = await question("Which network will you deploy to? (e.g., fuji, avalancheMainnet) ");
  
  console.log("\nA deployment script `deploy-recycling.ts` will be created.");
  
  const deployScriptContent = `
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying RecyclingCredits contract with the account:", deployer.address);

  const RecyclingCredits = await ethers.getContractFactory("${contractName}");
  
  // The constructor of RecyclingCredits requires the initial admin's address.
  const recyclingCredits = await RecyclingCredits.deploy(deployer.address);

  await recyclingCredits.waitForDeployment();
  
  const contractAddress = await recyclingCredits.getAddress();
  console.log("✅ RecyclingCredits contract deployed to:", contractAddress);

  console.log("\\nTo verify your contract, run:");
  console.log(\`npx hardhat verify --network ${network} \${contractAddress} "\${deployer.address}"\`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

  const scriptPath = path.join(__dirname, 'deploy-recycling.ts');
  fs.writeFileSync(scriptPath, deployScriptContent.trim());
  
  console.log("\n✅ Successfully created `scripts/deploy-recycling.ts`!");
  console.log("\nNext steps:");
  console.log("1. Edit your `.env` file with your private key and RPC URL.");
  console.log(`2. Fund your deployer address on the ${network} network.`);
  console.log(`3. Run the deployment script: npx hardhat run scripts/deploy-recycling.ts --network ${network}`);
  
  rl.close();
}

main().catch(error => {
  console.error(error);
  rl.close();
  process.exitCode = 1;
});