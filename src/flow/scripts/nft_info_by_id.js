import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";
//import editions from "../assets/editions"

export default function NftInfobyid(props) {
  //const [metadata, setMetadata] = useState(null);
console.log('HERE yo');
console.log(props.id)

  const fetchData2 = async () => {
    const data = await fcl.query({
      cadence: `
        import NFTCatalog from "../contracts/NFTCatalog.cdc"

        pub fun main(collectionIdentifier: String): NFTCatalog.NFTCatalogMetadata? {
            return NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)
        }
        
        pub fun main(id: UInt64): NFT {
          return NFTCatalog.getCatalogEntry(collectionIdentifier: id)
      `,
      args: (arg, t) => [
        arg(props.id, t.UInt64),
      ],
    });

    console.log("Something something something contract call, something something complete!");

    const json = await data;
    console.info(json);
  };
  fetchData2().catch(console.error);
  return "yo";
}
