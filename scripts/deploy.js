////////////////RESOURCES/////////////////////
/**NFT Contract Deployed at: 0x271E4EAAFB2dC5BD0eD6f0D6D14db707CC77FE9D
Deploying RewardToken Contract........
RewardToken Contract Deployed 0x10f04018D59953c8274d0dadc678652FAfA89D40 */

//Import hardhat
const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  //Get Factory
  const RandomApeFactory = await ethers.getContractFactory("RandomAPE");
  const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
  const NFTStakingFactory = await ethers.getContractFactory("NFTStaking");

  //Deploy
  console.log(`Deploying NFT Contract........`);
  const RandomApe = await RandomApeFactory.deploy();
  console.log(`NFT Contract Deployed at: ${RandomApe.address}`);

  console.log(`Deploying RewardToken Contract........`);
  const RewardToken = await RewardTokenFactory.deploy();
  console.log(`RewardToken Contract Deployed ${RewardToken.address}`);

  console.log(`Deploying NFTStaking Contract........`);
  const NFTStaking = await NFTStakingFactory.deploy(
    RandomApe.address,
    RewardToken.address
  );
  console.log(`Staking Contract deployed at: ${NFTStaking.address}`);

  //Auto-verifying the Contract on Etherscan
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Awaiting Transaction confirmation. Please Wait...");
    await NFTStaking.deployTransaction.wait(6);
    await verify(NFTStaking.address, [RandomApe.address, RewardToken.address]);
  }
}
async function verify(contractAddress, args) {
  console.log("Verifying contract.....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already Verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
}

// call the function
main().then(() =>
  process.exit(0).catch((error) => {
    console.error(error);
    process.exit(1);
  })
);
