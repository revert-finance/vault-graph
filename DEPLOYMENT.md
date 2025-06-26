# Multi-Chain Deployment Guide

This subgraph can be deployed on Arbitrum, Base, and Ethereum Mainnet.

## Prerequisites

1. Install dependencies: `npm install`
2. Authenticate with Subgraph Studio: `graph auth --studio <deploy-key>`

## Configuration

Before deploying, you need to update the network-specific configuration files with the correct contract addresses and start blocks:

### Base (`subgraph-base.yaml`)
- Update `address` with the V3Vault contract address on Base
- Update `startBlock` with the block number when the contract was deployed on Base

### Mainnet (`subgraph-mainnet.yaml`)
- Update `address` with the V3Vault contract address on Mainnet
- Update `startBlock` with the block number when the contract was deployed on Mainnet

### Arbitrum (`subgraph-arbitrum.yaml`)
- Already configured for Arbitrum

## Deployment Commands

### Build for specific networks:
```bash
npm run build:arbitrum
npm run build:base
npm run build:mainnet
```

### Deploy to specific networks:
```bash
npm run deploy:arbitrum
npm run deploy:base
npm run deploy:mainnet
```

## Subgraph Studio Setup

You'll need to create separate subgraphs in Subgraph Studio for each network:
1. `revert-vault-arbitrum` (already exists)
2. `revert-vault-base` (new)
3. `revert-vault-mainnet` (new)

## Notes

- Each network will have its own indexed data
- The same codebase is used for all networks
- Make sure to use the correct contract addresses and start blocks for each network
- Monitor indexing progress in Subgraph Studio after deployment 