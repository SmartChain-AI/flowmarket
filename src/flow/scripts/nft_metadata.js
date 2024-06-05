import * as fcl from "@onflow/fcl";
//import { useState, useEffect } from "react";
//import editions from "../assets/editions"

export default function NftMetadata({address,id}) {
 // const [metadata, setMetadata] = useState(null);
  //if (address) { return; }
  let addy = ""


//console.log(`Address ${address} - ID: ${id}`)
  const fetchData2 = async () => {
    console.log("fetching")
    const data = await fcl.query({
      cadence: `
        import UFC_NFT from 0x329feb3ab062d289
        import MetadataViews from 0x1d7e57aa55817448
        
        /// This script gets all the view-based metadata associated with the specified NFT
        /// and returns it as a single struct
        pub struct NFT {
            pub let name: String
            pub let description: String
            pub let thumbnail: String
            pub let owner: Address
            pub let type: String
            pub let royalties: [MetadataViews.Royalty]
            pub let externalURL: String
            pub let serialNumber: UInt64
            pub let collectionPublicPath: PublicPath
            pub let collectionStoragePath: StoragePath
            pub let collectionProviderPath: PrivatePath
            pub let collectionPublic: String
            pub let collectionPublicLinkedType: String
            pub let collectionProviderLinkedType: String
            pub let collectionName: String
            pub let collectionDescription: String
            pub let collectionExternalURL: String
            pub let collectionSquareImage: String
            pub let collectionBannerImage: String
            pub let collectionSocials: {String: String}
            pub let edition: MetadataViews.Edition
            pub let traits: MetadataViews.Traits
            pub let medias: MetadataViews.Medias?
            pub let license: MetadataViews.License?
        
            init(
                name: String,
                description: String,
                thumbnail: String,
                owner: Address,
                nftType: String,
                royalties: [MetadataViews.Royalty],
                externalURL: String,
                serialNumber: UInt64,
                collectionPublicPath: PublicPath,
                collectionStoragePath: StoragePath,
                collectionProviderPath: PrivatePath,
                collectionPublic: String,
                collectionPublicLinkedType: String,
                collectionProviderLinkedType: String,
                collectionName: String,
                collectionDescription: String,
                collectionExternalURL: String,
                collectionSquareImage: String,
                collectionBannerImage: String,
                collectionSocials: {String: String},
                edition: MetadataViews.Edition,
                traits: MetadataViews.Traits,
                medias:MetadataViews.Medias?,
                license:MetadataViews.License?
            ) {
                self.name = name
                self.description = description
                self.thumbnail = thumbnail
                self.owner = owner
                self.type = nftType
                self.royalties = royalties
                self.externalURL = externalURL
                self.serialNumber = serialNumber
                self.collectionPublicPath = collectionPublicPath
                self.collectionStoragePath = collectionStoragePath
                self.collectionProviderPath = collectionProviderPath
                self.collectionPublic = collectionPublic
                self.collectionPublicLinkedType = collectionPublicLinkedType
                self.collectionProviderLinkedType = collectionProviderLinkedType
                self.collectionName = collectionName
                self.collectionDescription = collectionDescription
                self.collectionExternalURL = collectionExternalURL
                self.collectionSquareImage = collectionSquareImage
                self.collectionBannerImage = collectionBannerImage
                self.collectionSocials = collectionSocials
                self.edition = edition
                self.traits = traits
                self.medias=medias
                self.license=license
            }
        }
        
        pub fun main(address: Address, id: UInt64): NFT {
            let account = getAccount(address)
        
            let collection = account
                .getCapability(UFC_NFT.CollectionPublicPath)
                .borrow<&{UFC_NFT.UFC_NFTCollectionPublic}>()
                ?? panic("Could not borrow a reference to the collection")
        
            let nft = collection.borrowUFC_NFT(id: id)!
        
            // Get the basic display information for this NFT
            let display = MetadataViews.getDisplay(nft)!
        
            // Get the royalty information for the given NFT
            let royaltyView = MetadataViews.getRoyalties(nft)!
        
            let externalURL = MetadataViews.getExternalURL(nft)!
        
            let collectionDisplay = MetadataViews.getNFTCollectionDisplay(nft)!
            let nftCollectionView = MetadataViews.getNFTCollectionData(nft)!
        
            let nftEditionView = MetadataViews.getEditions(nft)!
            let serialNumberView = MetadataViews.getSerial(nft)!
            
            let owner: Address = nft.owner!.address!
            let nftType = nft.getType()
        
            let collectionSocials: {String: String} = {}
            for key in collectionDisplay.socials.keys {
                collectionSocials[key] = collectionDisplay.socials[key]!.url
            }
        
            let traits = MetadataViews.getTraits(nft)!
        
            let medias=MetadataViews.getMedias(nft)
            let license=MetadataViews.getLicense(nft)
        
            return NFT(
                name: display.name,
                description: display.description,
                thumbnail: display.thumbnail.uri(),
                owner: owner,
                nftType: nftType.identifier,
                royalties: royaltyView.getRoyalties(),
                externalURL: externalURL.url,
                serialNumber: serialNumberView.number,
                collectionPublicPath: nftCollectionView.publicPath,
                collectionStoragePath: nftCollectionView.storagePath,
                collectionProviderPath: nftCollectionView.providerPath,
                collectionPublic: nftCollectionView.publicCollection.identifier,
                collectionPublicLinkedType: nftCollectionView.publicLinkedType.identifier,
                collectionProviderLinkedType: nftCollectionView.providerLinkedType.identifier,
                collectionName: collectionDisplay.name,
                collectionDescription: collectionDisplay.description,
                collectionExternalURL: collectionDisplay.externalURL.url,
                collectionSquareImage: collectionDisplay.squareImage.file.uri(),
                collectionBannerImage: collectionDisplay.bannerImage.file.uri(),
                collectionSocials: collectionSocials,
                edition: nftEditionView.infoList[0],
                traits: traits,
                medias:medias,
                license:license
            )
        }
      `,
      args: (arg, t) => [
        arg(addy, t.Address),
        arg(id, t.UInt64),
      ],
    });

    console.log("SERIAL NUMBER: " + data.edition.number);  
    return data.edition.number
  };

  async function yo(){
    //console.log("HERE:"+address)
  const tx = await fcl
  .send([
    fcl.getTransaction(
      address
    ),
  ])
  .then(fcl.decode);
console.info(tx)
addy = "0x"+tx.proposalKey.address
console.log("ADDY:"+addy+" ID:"+id)
fetchData2()
}


  const test = yo()
  return test
}
