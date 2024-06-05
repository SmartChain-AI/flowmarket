import * as fcl from "@onflow/fcl"
import { useState } from "react"
import NftMetadata from './nft_metadata.js'

export default function Nftsinwallet(props) {
  const [nftsinwallet, setNftsinwallet] = useState()
  let wd = []
  let ignore = 1;

  if (!props.address.addr) { return }

  const fetchData = async () => {
    const data = await fcl.query({
      cadence: `
    import MetadataViews from 0x1d7e57aa55817448
    import NFTCatalog from 0x49a7cda3a1eecc29
    import NFTRetrieval from 0x49a7cda3a1eecc29

    pub struct NFT {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        pub let externalURL: String
        pub let storagePath: StoragePath
        pub let publicPath: PublicPath
        pub let privatePath: PrivatePath
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type
        pub let collectionName: String
        pub let collectionDescription: String
        pub let collectionSquareImage: String
        pub let collectionBannerImage: String
        pub let collectionExternalURL: String
        pub let royalties: [MetadataViews.Royalty]

        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
            externalURL: String,
            storagePath: StoragePath,
            publicPath: PublicPath,
            privatePath: PrivatePath,
            publicLinkedType: Type,
            privateLinkedType: Type,
            collectionName: String,
            collectionDescription: String,
            collectionSquareImage: String,
            collectionBannerImage: String,
            collectionExternalURL: String,
            royalties: [MetadataViews.Royalty]
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.externalURL = externalURL
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
            self.collectionName = collectionName
            self.collectionDescription = collectionDescription
            self.collectionSquareImage = collectionSquareImage
            self.collectionBannerImage = collectionBannerImage
            self.collectionExternalURL = collectionExternalURL
            self.royalties = royalties
        }
    }

    pub fun main(ownerAddress: Address): {String: [NFT]} {
        let account = getAuthAccount(ownerAddress)
        let items: [MetadataViews.NFTView] = []
        let data: {String: [NFT]} = {}

        NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
            let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
            let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
            let tempPathStr = "catalog".concat(keyHash)
            let tempPublicPath = PublicPath(identifier: tempPathStr)!

            account.link<&{MetadataViews.ResolverCollection}>(
                tempPublicPath,
                target: value.collectionData.storagePath
            )

            let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

            if !collectionCap.check() {
                return true
            }

            let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)
            let items: [NFT] = []

            for view in views {
                let displayView = view.display
                let externalURLView = view.externalURL
                let collectionDataView = view.collectionData
                let collectionDisplayView = view.collectionDisplay
                let royaltyView = view.royalties

                if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                    // Bad NFT. Skipping....
                    return true
                }

                items.append(
                    NFT(
                        id: view.id,
                        name: displayView!.name,
                        description: displayView!.description,
                        thumbnail: displayView!.thumbnail.uri(),
                        externalURL: externalURLView!.url,
                        storagePath: collectionDataView!.storagePath,
                        publicPath: collectionDataView!.publicPath,
                        privatePath: collectionDataView!.providerPath,
                        publicLinkedType: collectionDataView!.publicLinkedType,
                        privateLinkedType: collectionDataView!.providerLinkedType,
                        collectionName: collectionDisplayView!.name,
                        collectionDescription: collectionDisplayView!.description,
                        collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                        collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                        collectionExternalURL: collectionDisplayView!.externalURL.url,
                        royalties: royaltyView!.getRoyalties()
                    )
                )
            }
            data[collectionIdentifier] = items
            return true
        })
    return data
    }
      `,
      args: (arg, t) => [
        arg(props.address.addr.toString(), t.Address)
      ],
    });

    data.UFCStrike.forEach(element => {
      //console.log(props.address.addr);
      //console.log(element.id);
      console.log("in hurrr")
      const nftinfo = NftMetadata({address: props.address.addr, id:element.id})
      console.log("THIS")
      console.info(nftinfo)

    });
    return data.UFCStrike;
  }

  const ddata = fetchData().then(result => {
    console.info(result)
    if (!ignore) {
//result.forEach(()=>{<NftMetadata address={props.address.addr} id={result.id}/>})
//NftMetadata({address: props.address.addr, id:result.id})
      const listItems = result.map((items) =>
        <li key={items.id}>{items.name}</li>
      );
      ignore = 0;
      setNftsinwallet(listItems);
      
      return result
    }
  }
  ).catch(console.error);

  return (
    <>
      NFTs: {nftsinwallet && (
        <>
          <div className="text-green-500">
            {nftsinwallet}
          </div>
        </>
      )}
    </>
  );
}