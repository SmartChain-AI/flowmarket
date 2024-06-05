import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

export default function Capable(props) {
  const [capable, setCapable] = useState();
console.info(props)
  useEffect(() => {
    if (!props.address.loggedIn) { return; }

    const fetchData = async () => {
      const data = await fcl.query({
        cadence: `
      import UFC_NFT from 0x329feb3ab062d289
      import NonFungibleToken from 0x1d7e57aa55817448

      pub fun main(userAddress: Address): Bool {
        return getAccount(userAddress)
          .getCapability<&UFC_NFT.Collection{NonFungibleToken.Receiver}>(UFC_NFT.CollectionPublicPath)
          .check()
      }
      `,
        args: (arg, t) => [
          arg(props.address.addr, t.Address),
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
      Wallet authorised: {capable?(<><span className="text-green-500">Yes</span></>):(<><span className="">No</span></>)}
    </>
  );
}