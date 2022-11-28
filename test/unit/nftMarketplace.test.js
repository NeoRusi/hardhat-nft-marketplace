const { assert, expect } = require("chai")
const { network, ethers, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT marketplace unit tests", () => {
          let deployer, nftMarketplaceContract, nftMarketplace, nftAddress, player
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              player = (await getNamedAccounts()).player
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NFTMarketplace", deployer)
              nftMarketplaceContract = await ethers.getContract("NFTMarketplace", player)
              basicNft = await ethers.getContract("BasicNft", deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
              nftAddress = basicNft.address
          })
          it("Should deploy", async () => {
              //A contract is deployed if it has an address
              assert(nftMarketplace.address)
          })
          describe("listItem", () => {
              it("Should revert if the item is alredy listed", async () => {
                  await nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NFTMarketplace__AlreadyListed")
              })
              it("Should revert if the persone who does the listingis not an owner", async () => {
                  await expect(nftMarketplace.listItem("", TOKEN_ID, PRICE))
              })
              it("Should revert if price is less than 0 ", async () => {
                  await expect(nftMarketplace.listItem(nftAddress, TOKEN_ID, 0)).to.be.revertedWith(
                      "NFTMarketplace__PriceMustBeAboveZero"
                  )
              })
              it("Should update the listing", async () => {
                  const oldListing = nftMarketplace.getListing()
                  nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)
                  const newListing = nftMarketplace.getListing()
                  assert(oldListing != newListing)
              })
              it("Should emit an ItemListed event", async () => {
                  // !!!The way how to listen for events!!!
                  expect(await nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })
          })
          describe("buyItem", () => {
              it("Should pass only if the user is listed", async () => {
                  await expect(nftMarketplace.buyItem(nftAddress, TOKEN_ID)).to.be.revertedWith(
                      "NFTMarketplace__NotListed"
                  )
              })
              it('Should revert if the "msg.value" is less than the "listedItem.price"', async () => {
                  const NEW_PRICE = ethers.utils.parseEther("0.02")
                  await nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.buyItem(nftAddress, TOKEN_ID, { value: NEW_PRICE })
                  ).to.be.revertedWith("NFTMarketplace__PriceNotMet")
              })
              it('Should update the "s_proceeds"', async () => {})
              it('Should delete the "s_listings" mapping', async () => {})
              it('Should emit the "ItemBought" event', async () => {
                  await nftMarketplace.listItem(nftAddress, TOKEN_ID, PRICE)
                  expect(
                      await nftMarketplace.buyItem(nftAddress, TOKEN_ID, { value: PRICE })
                  ).to.emit("ItemBought")
              })
          })
          describe("cancelListing", () => {
              it("Should revert if the NFT is not listed", async () => {
                  await expect(
                      nftMarketplace.cancelListing(nftAddress, TOKEN_ID)
                  ).to.be.revertedWith("NFTMarketplace__NotListed")
              })
              it("Shouls revert if the caller is not the owner")
              it("")
              it("")
              it("")
          })
      })
