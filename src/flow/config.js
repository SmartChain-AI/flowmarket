import { config } from "@onflow/fcl";

config({
  "flow.network": "mainnet",
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "discovery.authn.include": ["0xead892083b3e2c6c"], // Dapper
  "walletconnect.projectId": "FlowMarket",
  "app.detail.title": "FlowMarket",
  "app.detail.icon": "https://flowmarket.io/apple-touch-icon.png",
  "app.detail.description": "FlowMarket - UFC Strike",
  "app.detail.url": "https://flowmarket.io",
})