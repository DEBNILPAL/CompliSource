import os
from typing import Optional
from web3 import Web3

# Try to import geth_poa_middleware, but make it optional for newer web3 versions
try:
    from web3.middleware import geth_poa_middleware
    HAS_POA_MIDDLEWARE = True
except ImportError:
    HAS_POA_MIDDLEWARE = False

# Minimal ABI for CompliRegistry.anchor(string) and view count()
COMPLI_REGISTRY_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "proofHash", "type": "string"}],
        "name": "anchor",
        "outputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function",
    },
]

class ChainClient:
    def __init__(self):
        self.rpc = os.getenv("ETH_RPC_URL")
        self.pk = os.getenv("PRIVATE_KEY")
        self.addr = os.getenv("REGISTRY_ADDRESS")
        self.chain_id_env = os.getenv("CHAIN_ID")
        self._w3: Optional[Web3] = None
        self._contract = None

        if self.rpc and self.pk and self.addr:
            w3 = Web3(Web3.HTTPProvider(self.rpc))
            # Attach POA middleware if needed (e.g., for local Hardhat/Polygon/BNB testnets)
            if HAS_POA_MIDDLEWARE:
                w3.middleware_onion.inject(geth_poa_middleware, layer=0)
            self._w3 = w3
            self._acct = w3.eth.account.from_key(self.pk)
            self._contract = w3.eth.contract(address=Web3.to_checksum_address(self.addr), abi=COMPLI_REGISTRY_ABI)
        
    def available(self) -> bool:
        return self._w3 is not None and self._contract is not None

    def anchor(self, proof_hash: str) -> str:
        assert self.available(), "Chain client not configured"
        w3 = self._w3
        contract = self._contract
        # Build tx
        nonce = w3.eth.get_transaction_count(self._acct.address)
        chain_id = int(self.chain_id_env) if self.chain_id_env else w3.eth.chain_id
        tx = contract.functions.anchor(proof_hash).build_transaction({
            "from": self._acct.address,
            "nonce": nonce,
            "chainId": chain_id,
            "gas": 300000,
            "maxFeePerGas": w3.to_wei('2', 'gwei'),
            "maxPriorityFeePerGas": w3.to_wei('1', 'gwei'),
        })
        signed = self._acct.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        return receipt.transactionHash.hex()

_client: Optional[ChainClient] = None

def get_client() -> ChainClient:
    global _client
    if _client is None:
        _client = ChainClient()
    return _client


def anchor_proof_if_configured(proof_hash: str) -> Optional[str]:
    client = get_client()
    if not client.available():
        return None
    try:
        return client.anchor(proof_hash)
    except Exception:
        # Fail open: return None so API still responds without blocking UX
        return None
