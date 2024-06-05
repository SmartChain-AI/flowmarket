import { config } from "@onflow/fcl";

config({
  "flow.network": "mainnet",
  "accessNode.api": "https://rest-mainnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  //"accessNode.api": "access.mainnet.nodes.onflow.org:9000", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "0xUFC": "0xead892083b3e2c6c", // The account address where the Profile smart contract lives on Testnet
  "discovery.authn.include": ["0xead892083b3e2c6c"] // Dapper
})