import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

export default function TotalSupply(props) {
  const [count, setCount] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fcl.query({
        cadence: `
      import UFC_NFT from 0x329feb3ab062d289

      pub fun main(): UInt64 {
        return UFC_NFT.totalSupply
      }
      `
      })
      const json = await data;
      setCount(json);
    }
    fetchData()
      // make sure to catch any error
      .catch(console.error);;
  }, [])

  return (<>{count}</>)
}