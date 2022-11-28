const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = await deployments
    const { deployer } = await getNamedAccounts()
    log("______________________________________")
    const args = []
    const nftMarketplace = await deploy("NFTMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifiying.....")
        await verify(nftMarketplace.address, args)
        log("___________________________________")
    }
}
module.exports.tags = ["all", "marketplace"]
