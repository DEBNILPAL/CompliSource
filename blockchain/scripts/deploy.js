const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("CompliRegistry");
  const registry = await Registry.deploy();
  await registry.deployed();
  console.log("CompliRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
