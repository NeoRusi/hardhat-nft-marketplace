const { ethers, network } = require("hardhat")
const { moveBlocks } = requird("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

async function mint() {
    const nftMarketplace = await ethers.getContract("NFTMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting....")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(`Got TokenID: ${tokenId}`)
    console.log(`NFT Address: ${basicNft.address}`)
}
mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
