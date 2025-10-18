# CompliSource Blockchain - Smart Contracts

This folder contains the Ethereum smart contracts for CompliSource's on-chain proof registry using Hardhat.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy Locally
```bash
# Terminal 1 - Start local blockchain
npx hardhat node

# Terminal 2 - Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

## 📁 Structure

```
blockchain/
├── contracts/
│   └── CompliRegistry.sol    # Main smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── hardhat.config.js         # Hardhat configuration
└── package.json              # Node dependencies
```

## 📜 Smart Contract: CompliRegistry.sol

### Purpose
Stores immutable proof hashes of compliance check runs on the blockchain, creating a verifiable audit trail.

### Key Features
- Record proof hashes with timestamp
- Query proofs by ID
- Event emission for off-chain indexing
- Owner management
- Gas-optimized storage

### Main Functions

#### `anchor(string calldata proofHash) external returns (uint256 id)`
Records a new compliance proof on-chain
- `proofHash`: SHA-256 hash of the compliance run
- Returns: Proof ID

#### `get(uint256 id) external view returns (address submitter, string memory proofHash, uint256 timestamp)`
Retrieves a recorded proof
- Returns: proof hash, timestamp, recorder address

#### `count() external view returns (uint256)`
Returns total number of proofs recorded

### Events

```solidity
event ProofAnchored(address indexed submitter, string proofHash, uint256 indexed id);
```

## 🔧 Configuration

### hardhat.config.js

```javascript
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

## 🌐 Deployment

### Local Development Network

1. **Start Hardhat Node:**
```bash
npx hardhat node
```
This creates a local blockchain with test accounts

2. **Deploy Contract:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. **Note the Contract Address:**
```
CompliRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Testnet Deployment (Example: Sepolia)

1. **Update hardhat.config.js:**
```javascript
sepolia: {
  url: process.env.SEPOLIA_RPC_URL,
  accounts: [process.env.PRIVATE_KEY]
}
```

2. **Set Environment Variables:**
```bash
export SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY"
export PRIVATE_KEY="your-private-key"
```

3. **Deploy:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment

⚠️ **Warning:** Carefully review and test on testnets first!
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```

### Test with Coverage
```bash
npm install --save-dev solidity-coverage
npx hardhat coverage
```

### Test Specific File
```bash
npx hardhat test test/CompliRegistry.test.js
```

## 📊 Gas Optimization

### Current Estimates
- Deploy: ~500,000 gas
- Record Proof: ~50,000 gas
- Get Proof: View function (free)

### Optimization Tips
- Use `bytes32` for hashes (cheaper than `string`)
- Emit events instead of storing too much data
- Pack structs efficiently
- Use `view`/`pure` functions where possible

## 🔗 Integration with Backend

The backend (`backend/blockchain.py`) integrates with these contracts:

```python
from web3 import Web3

# Connect to blockchain
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Load contract
contract = w3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=CONTRACT_ABI
)

# Record proof
tx = contract.functions.anchor(proof_hash).transact({'from': account})

# Get proof
proof = contract.functions.get(proof_id).call()
```

## 📦 Dependencies

From `package.json`:
- **hardhat** - Development environment
- **@nomiclabs/hardhat-ethers** - Ethers.js plugin
- **ethers** - Ethereum library
- **@nomiclabs/hardhat-waffle** - Testing framework
- **chai** - Assertions

## 🔐 Security Considerations

### Best Practices
- ✅ Use OpenZeppelin contracts where possible
- ✅ Test thoroughly on testnets
- ✅ Get smart contract audit before mainnet
- ✅ Use multi-sig wallets for ownership
- ✅ Implement emergency pause mechanism
- ✅ Set proper gas limits

### Security Checklist
- [ ] Reentrancy protection
- [ ] Integer overflow checks (Solidity 0.8+)
- [ ] Access control properly implemented
- [ ] Events emitted for important state changes
- [ ] Input validation
- [ ] Gas optimization

## 🛠️ Development Workflow

### 1. Write Contract
Edit `contracts/CompliRegistry.sol`

### 2. Compile
```bash
npx hardhat compile
```

### 3. Test
```bash
npx hardhat test
```

### 4. Deploy to Local
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Test Integration
Point backend to the deployed contract address

### 6. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 7. Verify Contract (Optional)
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 📝 Example Usage

### Recording a Proof

```javascript
const { ethers } = require("hardhat");

async function main() {
  const CompliRegistry = await ethers.getContractFactory("CompliRegistry");
  const registry = await CompliRegistry.attach(CONTRACT_ADDRESS);
  
  const proofHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("compliance-data")
  );
  
  const tx = await registry.anchor(proofHash);
  const receipt = await tx.wait();
  
  console.log("Proof recorded:", receipt);
}

main();
```

## 🔍 Verifying Proofs

Anyone can verify a proof on the blockchain:

```javascript
const proof = await registry.get(proofId);
console.log("Proof Hash:", proof.proofHash);
console.log("Timestamp:", new Date(proof.timestamp * 1000));
console.log("Recorder:", proof.recorder);
```

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 🐛 Troubleshooting

**Compilation errors:**
```bash
npx hardhat clean
npx hardhat compile
```

**Network connection failed:**
Check if RPC URL and API keys are correct in .env

**Out of gas:**
Increase gas limit in transaction or optimize contract

**Nonce too low:**
Reset account nonce or wait for pending transactions

---

**⛓️ This blockchain layer adds immutable, verifiable proof storage to CompliSource's compliance engine for real-world audit trails!**
