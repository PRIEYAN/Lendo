/**
 * CreditRegistry ABI
 * Generated from CreditRegistry.sol
 */
export const CREDIT_REGISTRY_ABI = [
  {
    inputs: [],
    name: "BASE_CREDIT_SCORE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_CREDIT_SCORE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "getCreditScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "getCreditProfile",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "creditScore", type: "uint256" },
          { internalType: "uint256", name: "circlesJoined", type: "uint256" },
          { internalType: "uint256", name: "circlesCompleted", type: "uint256" },
          { internalType: "uint256", name: "onTimePayments", type: "uint256" },
          { internalType: "uint256", name: "latePayments", type: "uint256" },
          { internalType: "uint256", name: "defaults", type: "uint256" },
          { internalType: "bool", name: "hasDefaulted", type: "bool" },
        ],
        internalType: "struct CreditRegistry.CreditProfile",
        name: "profile",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "recordOnTimePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "recordLatePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "recordDefault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "participant", type: "address" }],
    name: "recordCircleCompletion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "participant", type: "address" },
      { indexed: false, internalType: "uint256", name: "newScore", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "previousScore", type: "uint256" },
    ],
    name: "CreditScoreUpdated",
    type: "event",
  },
] as const;
