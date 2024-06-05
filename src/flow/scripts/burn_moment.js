import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

export default function BurnMoment(props) {
  const [capable, setCapable] = useState();
  console.info(props)
  useEffect(() => {
  //  if (!props.address.loggedIn) { return; }

    const fetchData = async () => {
      const data = await fcl.query({
        cadence: `
      import UFC_NFT from 0x329feb3ab062d289
      import NonFungibleToken from 0x1d7e57aa55817448
  
      transaction(id: UInt64) {
  
      /// Reference that will be used for the owner's collection
      let collectionRef: &UFC_NFT.Collection
  
      prepare(signer: AuthAccount) {
  
          // borrow a reference to the owner's collection
          self.collectionRef = signer.borrow<&UFC_NFT.Collection>(from: UFC_NFT.CollectionStoragePath)
              ?? panic("Account does not store an object at the specified path")
  
      }
  
      execute {
  
          // withdraw the NFT from the owner's collection
          let nft <- self.collectionRef.withdraw(withdrawID: id)
  
          destroy nft
      }
  
      post {
          !self.collectionRef.getIDs().contains(id): "The NFT with the specified ID should have been deleted"
      }
  }
      `,
        args: (arg, t) => [
          arg(props.nftid, t.UInt64),
        ],
      })
      console.info(data);
      setCapable(data.toString());
    }
    fetchData()
      // make sure to catch any error
      .catch(console.error);

  })

  return (
    <>
      Wallet authorised: {capable ? (<><span className="text-green-500">Yes</span></>) : (<><span className="">No</span></>)}
    </>
  );
}