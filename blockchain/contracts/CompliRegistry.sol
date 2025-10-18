// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CompliRegistry {
    event ProofAnchored(address indexed submitter, string proofHash, uint256 indexed id);

    struct Proof {
        address submitter;
        string proofHash; // sha256 hex string
        uint256 timestamp;
    }

    Proof[] public proofs;

    function anchor(string calldata proofHash) external returns (uint256 id) {
        proofs.push(Proof({submitter: msg.sender, proofHash: proofHash, timestamp: block.timestamp}));
        id = proofs.length - 1;
        emit ProofAnchored(msg.sender, proofHash, id);
    }

    function get(uint256 id) external view returns (address submitter, string memory proofHash, uint256 timestamp) {
        Proof memory p = proofs[id];
        return (p.submitter, p.proofHash, p.timestamp);
    }

    function count() external view returns (uint256) {
        return proofs.length;
    }
}
