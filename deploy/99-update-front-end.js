const { ethers, network } = require("hardhat")
const fs = require("fs")

const frontEndContractsFile =
    "./nextjs-hardhat-nft-marketpace-moralis-io/constants/networkMapping.json"
const frontEndAbiLocation = "./nextjs-hardhat-nft-marketpace-moralis-io/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front-end.....")
        await updateContractAddresses()
        await updateABI()
    }
}
async function updateABI() {
    const nftMarketplace = await ethers.getContract("NFTMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation} NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation} BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}
async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NFTMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NFTMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NFTMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NFTMarketplace: [nftMarketplace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
