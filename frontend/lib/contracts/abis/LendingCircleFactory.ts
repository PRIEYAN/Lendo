/**
 * LendingCircleFactory ABI
 */
export const LENDING_CIRCLE_FACTORY_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "monthlyContribution", type: "uint256" },
      { internalType: "uint256", name: "durationInMonths", type: "uint256" },
      { internalType: "uint256", name: "minParticipants", type: "uint256" },
      { internalType: "uint256", name: "maxParticipants", type: "uint256" },
      { internalType: "uint256", name: "reservePercentage", type: "uint256" },
      { internalType: "uint8", name: "excessDistributionMethod", type: "uint8" },
    ],
    name: "createCircle",
    outputs: [{ internalType: "address", name: "circle", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCircleCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserCircles",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "offset", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "getCircles",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creditRegistry",
    outputs: [{ internalType: "contract CreditRegistry", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: true, internalType: "address", name: "circle", type: "address" },
      { indexed: false, internalType: "uint256", name: "monthlyContribution", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "durationInMonths", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "minParticipants", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "maxParticipants", type: "uint256" },
    ],
    name: "CircleCreated",
    type: "event",
  },
] as const;
