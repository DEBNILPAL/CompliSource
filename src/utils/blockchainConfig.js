// Multi-chain blockchain configuration

export const blockchains = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    icon: '⟠',
    color: '#627EEA',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    explorerUrl: 'https://etherscan.io',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    avgGasPrice: 50, // Gwei
    avgTxCost: 15, // USD
    confirmationTime: '~15 seconds',
    description: 'Most secure, highest decentralization',
    pros: ['Maximum security', 'Largest ecosystem', 'Most trusted'],
    cons: ['High gas fees', 'Slower transactions']
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    symbol: 'MATIC',
    icon: '◆',
    color: '#8247E5',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    contractAddress: '0x8B3d1e8C6f5e4F1a9b2C3d4e5f6a7b8c9d0e1f2',
    avgGasPrice: 30, // Gwei
    avgTxCost: 0.01, // USD
    confirmationTime: '~2 seconds',
    description: 'Fast, cheap, Ethereum-compatible',
    pros: ['Very low fees', 'Fast finality', 'Ethereum compatible'],
    cons: ['Less decentralized', 'Newer network']
  },
  bsc: {
    name: 'Binance Smart Chain',
    chainId: 56,
    symbol: 'BNB',
    icon: '🔶',
    color: '#F3BA2F',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    contractAddress: '0x9A8f3e2B1C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8',
    avgGasPrice: 5, // Gwei
    avgTxCost: 0.20, // USD
    confirmationTime: '~3 seconds',
    description: 'Low cost, fast transactions',
    pros: ['Low fees', 'Fast speed', 'Large user base'],
    cons: ['More centralized', 'Lower security']
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    symbol: 'ETH',
    icon: '🔵',
    color: '#28A0F0',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    contractAddress: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B',
    avgGasPrice: 0.1, // Gwei
    avgTxCost: 0.50, // USD
    confirmationTime: '~1 second',
    description: 'Ethereum Layer 2, ultra-low fees',
    pros: ['Ethereum security', 'Very low fees', 'Fast'],
    cons: ['Withdrawal delays', 'Complex setup']
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    symbol: 'ETH',
    icon: '🔴',
    color: '#FF0420',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    contractAddress: '0xB2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C',
    avgGasPrice: 0.001, // Gwei
    avgTxCost: 0.30, // USD
    confirmationTime: '~1 second',
    description: 'Optimistic rollup, cheap & fast',
    pros: ['Very low fees', 'Ethereum security', 'Growing ecosystem'],
    cons: ['Withdrawal delays', 'Newer technology']
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    symbol: 'AVAX',
    icon: '🔺',
    color: '#E84142',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    contractAddress: '0xC3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D',
    avgGasPrice: 25, // nAVAX
    avgTxCost: 0.50, // USD
    confirmationTime: '~2 seconds',
    description: 'High throughput, sub-second finality',
    pros: ['Very fast', 'Low fees', 'Scalable'],
    cons: ['Smaller ecosystem', 'Less battle-tested']
  }
}

export function getBlockchainList() {
  return Object.entries(blockchains).map(([key, data]) => ({
    key,
    name: data.name,
    icon: data.icon,
    display: `${data.icon} ${data.name}`
  }))
}

export function estimateGasCost(blockchain) {
  const chain = blockchains[blockchain]
  return {
    cost: chain.avgTxCost,
    currency: 'USD',
    time: chain.confirmationTime,
    formatted: `$${chain.avgTxCost.toFixed(2)}`
  }
}

export function compareChains(chains) {
  return chains.map(key => {
    const chain = blockchains[key]
    return {
      name: chain.name,
      cost: chain.avgTxCost,
      time: chain.confirmationTime,
      security: key === 'ethereum' ? 'Highest' : key === 'polygon' || key === 'arbitrum' || key === 'optimism' ? 'High' : 'Medium'
    }
  })
}

export function recommendChain(requirements) {
  const { priority } = requirements // 'cost', 'speed', or 'security'
  
  if (priority === 'cost') {
    return 'polygon' // Cheapest
  } else if (priority === 'speed') {
    return 'arbitrum' // Fastest with good security
  } else if (priority === 'security') {
    return 'ethereum' // Most secure
  } else {
    return 'polygon' // Default: best balance
  }
}

export function getExplorerLink(blockchain, txHash) {
  const chain = blockchains[blockchain]
  return `${chain.explorerUrl}/tx/${txHash}`
}

// Mock function to simulate blockchain transaction
export async function anchorProofToChain(blockchain, proofHash) {
  const chain = blockchains[blockchain]
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate mock transaction hash
  const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  
  return {
    success: true,
    txHash: mockTxHash,
    blockchain: chain.name,
    explorerUrl: `${chain.explorerUrl}/tx/${mockTxHash}`,
    gasUsed: chain.avgGasPrice,
    cost: chain.avgTxCost,
    confirmationTime: chain.confirmationTime,
    blockNumber: Math.floor(Math.random() * 10000000) + 1000000
  }
}
