// Flow
import "src/flow/config"
import * as fcl from "@onflow/fcl"
import { block } from "@onflow/fcl"

export default async function handler(req, res) {

    let tmpa = []

  //  let sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    //async function yo2() {



        const yo = await fetch('https://accounts.meetdapper.com/api/access-token')
        .then((res) => res.json())
        .then((data) => {      
          return data.accessToken
        })
    
      const done = yo

console.info(yo)
      
   //      return
   // }

   //yo2()
    return
}