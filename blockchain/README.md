# CreditCoin-Based Lending Circle Protocol

A decentralized lending circle protocol built on Ethereum using Hardhat, where participants form circles, make monthly contributions, and vote on payout recipients based on credit scores.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Contracts](#contracts)
- [Deployment](#deployment)
- [Interaction Guide](#interaction-guide)
- [Workflow Examples](#workflow-examples)
- [Security Features](#security-features)
- [Credit Score System](#credit-score-system)

## 🎯 Overview

This protocol enables participants to form lending circles where:
- **Participants** make monthly contributions
- Funds are split between a **circle pool** and a **reserve pool**
- Participants **vote** (weighted by credit score) to select payout recipients
- **Credit scores** determine limits and voting power
- No admin role exists - only participants with credit-based permissions

### Key Features

- ✅ Credit-based circle creation limits
- ✅ Weighted voting system (by credit score)
- ✅ Reserve pool for risk management
- ✅ Automatic credit score tracking
- ✅ Default handling and penalties
- ✅ Excess fund distribution (withdrawable or auto-deduct)

## 🏗️ Architecture

```
┌─────────────────────┐
│ CreditRegistry.sol  │  ← Tracks credit scores for all participants
└──────────┬──────────┘
           │
           │
┌──────────▼──────────┐
│LendingCircleFactory │  ← Creates and manages lending circles
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
┌──────────▼──────────┐  ┌──▼──────────────┐
│  LendingCircle.sol   │  │  ReservePool.sol│
│  (per circle)        │  │                 │
└─────────────────────┘  └──────────────────┘
```

### Contract Relationships

1. **CreditRegistry**: Central registry tracking all participant credit scores
2. **ReservePool**: Shared pool receiving reserve percentage from all circles
3. **LendingCircleFactory**: Factory contract that creates new circles
4. **LendingCircle**: Individual circle contract managing participants and payouts

## 📄 Contracts

### 1. CreditRegistry.sol

**Purpose**: Centralized credit score tracking for all participants.

**Key Functions**:
- `getCreditScore(address)` - Get current credit score (0-1000)
- `recordOnTimePayment(address)` - +10 credit points
- `recordLatePayment(address)` - -20 credit points
- `recordDefault(address)` - -100 credit points
- `recordCircleCompletion(address)` - +15 credit points

**Credit Score Rules**:
- Base score: **300** points
- Maximum: **1000** points
- Minimum: **0** points
- Scores update deterministically on-chain

**Example**:
```solidity
// Get credit score
uint256 score = creditRegistry.getCreditScore(userAddress);

// Record payment (called by LendingCircle)
creditRegistry.recordOnTimePayment(userAddress);
```

### 2. ReservePool.sol

**Purpose**: Manages reserve funds from all lending circles.

**Key Functions**:
- `deposit()` - Deposit reserve funds (only verified circles)
- `withdraw(amount, recipient)` - Withdraw funds (only verified circles)
- `getUtilizationRate()` - Get utilization percentage

**Security**:
- Only verified LendingCircle contracts can deposit/withdraw
- Factory verifies circles upon creation
- Transparent event logging

**Example**:
```solidity
// Deposit reserve (called by LendingCircle)
reservePool.deposit{value: reserveAmount}();

// Withdraw if needed (called by LendingCircle)
reservePool.withdraw(shortfall, address(this));
```

### 3. LendingCircleFactory.sol

**Purpose**: Factory contract for creating new lending circles.

**Key Functions**:
- `createCircle(...)` - Create a new lending circle
- `getCircleCount()` - Get total number of circles
- `getUserCircles(address)` - Get circles created by a user
- `getCircles(offset, limit)` - Paginated circle list

**Parameters for `createCircle`**:
- `monthlyContribution` - Amount each participant pays monthly
- `durationInMonths` - How long the circle runs
- `minParticipants` - Minimum participants required
- `maxParticipants` - Maximum participants allowed
- `reservePercentage` - Percentage going to reserve (0-100)
- `excessDistributionMethod` - WITHDRAWABLE or AUTO_DEDUCT

**Example**:
```solidity
// Create a new circle
address newCircle = factory.createCircle(
    1 ether,                    // monthlyContribution
    6,                          // durationInMonths
    4,                          // minParticipants
    8,                          // maxParticipants
    10,                         // reservePercentage (10%)
    LendingCircle.ExcessDistributionMethod.WITHDRAWABLE
);
```

### 4. LendingCircle.sol

**Purpose**: Manages a single lending circle with participants, contributions, and payouts.

**Key Functions**:

#### Circle Management
- `requestToJoin()` - Request to join the circle
- `approveParticipant(address)` - Approve a participant (coordinator only)
- `rejectParticipant(address)` - Reject a participant (coordinator only)

#### Contributions
- `makeContribution(uint256 month)` - Make monthly payment
- `recordLatePayment(address, uint256 month)` - Record late payment (coordinator)
- `recordDefault(address, uint256 month)` - Record default (coordinator)

#### Voting & Payouts
- `proposePayout(address candidate, uint256 month)` - Propose a candidate
- `vote(uint256 month, address candidate)` - Vote for a candidate
- `executePayout(uint256 month)` - Execute payout after voting

#### Utilities
- `getActiveParticipantCount()` - Get number of active participants
- `hasPaidForMonth(address, uint256)` - Check payment status
- `getCandidates(uint256 month)` - Get all candidates for a month
- `getCandidateVotes(uint256 month, address)` - Get vote count
- `withdrawExcess()` - Withdraw excess balance (if WITHDRAWABLE)

**Credit-Based Limits** (enforced at creation):
- Max contribution: `creditScore * 1 ETH`
- Max participants: `creditScore * 1`
- Max exposure: `creditScore * 10 ETH`

**Voting System**:
- Weighted by credit score
- Multiple candidates can be proposed
- Tie-breaking by credit score
- Winner receives pool balance for that month

**Example**:
```solidity
// Join circle
lendingCircle.requestToJoin();

// Make contribution
lendingCircle.makeContribution{value: 1 ether}(0); // Month 0

// Propose candidate
lendingCircle.proposePayout(candidateAddress, 0);

// Vote
lendingCircle.vote(0, candidateAddress);

// Execute payout (after voting period)
lendingCircle.executePayout(0);
```

## 🚀 Deployment

### Prerequisites

```bash
npm install
# or
pnpm install
```

### Deployment Order

1. **Deploy CreditRegistry**
2. **Deploy ReservePool** (sets factory as owner)
3. **Deploy LendingCircleFactory** (with CreditRegistry and ReservePool addresses)
4. **Factory automatically verifies circles** when created

### Example Deployment Script

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // 1. Deploy CreditRegistry
  const CreditRegistry = await hre.ethers.getContractFactory("CreditRegistry");
  const creditRegistry = await CreditRegistry.deploy();
  await creditRegistry.waitForDeployment();
  console.log("CreditRegistry deployed to:", await creditRegistry.getAddress());

  // 2. Deploy ReservePool
  const ReservePool = await hre.ethers.getContractFactory("ReservePool");
  const reservePool = await ReservePool.deploy();
  await reservePool.waitForDeployment();
  console.log("ReservePool deployed to:", await reservePool.getAddress());

  // 3. Deploy Factory
  const Factory = await hre.ethers.getContractFactory("LendingCircleFactory");
  const factory = await Factory.deploy(
    await creditRegistry.getAddress(),
    await reservePool.getAddress()
  );
  await factory.waitForDeployment();
  console.log("Factory deployed to:", await factory.getAddress());

  // Transfer ReservePool ownership to Factory
  // (Note: ReservePool sets factory in constructor, adjust if needed)
}
```

## 💻 Interaction Guide

### Step 1: Create a Lending Circle

```javascript
const factory = await ethers.getContractAt("LendingCircleFactory", factoryAddress);

const tx = await factory.createCircle(
  ethers.parseEther("1"),      // 1 ETH monthly
  6,                            // 6 months
  4,                            // min 4 participants
  8,                            // max 8 participants
  10,                           // 10% to reserve
  0                             // WITHDRAWABLE (0) or AUTO_DEDUCT (1)
);

const receipt = await tx.wait();
const circleAddress = receipt.logs[0].args.circle;
```

### Step 2: Participants Join

```javascript
const circle = await ethers.getContractAt("LendingCircle", circleAddress);

// User requests to join
await circle.requestToJoin();

// Coordinator approves
await circle.approveParticipant(userAddress);

// Circle activates when minParticipants reached
```

### Step 3: Make Monthly Contributions

```javascript
// Each participant makes contribution for current month
const currentMonth = await circle.currentMonth();

await circle.makeContribution(currentMonth, {
  value: ethers.parseEther("1") // monthlyContribution amount
});
```

### Step 4: Propose and Vote for Payout

```javascript
// Anyone can propose a candidate
await circle.proposePayout(candidateAddress, currentMonth);

// All participants vote (weighted by credit score)
await circle.vote(currentMonth, candidateAddress);

// After voting period ends, execute payout
await circle.executePayout(currentMonth);
```

### Step 5: Handle Late Payments / Defaults

```javascript
// Coordinator records late payment
await circle.recordLatePayment(participantAddress, month);

// Coordinator records default
await circle.recordDefault(participantAddress, month);
```

### Step 6: Withdraw Excess (if WITHDRAWABLE)

```javascript
// Check withdrawable balance
const participant = await circle.participants(userAddress);
const balance = participant.withdrawableBalance;

// Withdraw
await circle.withdrawExcess();
```

## 📖 Workflow Examples

### Complete Circle Lifecycle

```javascript
// 1. Creator creates circle
const circle = await factory.createCircle(...);

// 2. Participants join
await circle.requestToJoin();
await circle.approveParticipant(user1);
await circle.approveParticipant(user2);
// ... until minParticipants reached

// 3. Circle becomes ACTIVE
// Status automatically changes when minParticipants reached

// 4. Month 0: All participants contribute
await circle.makeContribution(0, {value: monthlyContribution});

// 5. Propose candidates and vote
await circle.proposePayout(user1, 0);
await circle.proposePayout(user2, 0);
await circle.vote(0, user1);
await circle.vote(0, user2);
// ... more votes

// 6. Execute payout
await circle.executePayout(0);
// user1 or user2 receives payout based on votes

// 7. Repeat for months 1, 2, 3, etc.

// 8. Circle completes after durationInMonths
// All active participants get completion bonus
```

### Credit Score Impact

```javascript
// Check credit score
const score = await creditRegistry.getCreditScore(userAddress);

// On-time payment increases score
await circle.makeContribution(0, {value: monthlyContribution});
// Score: 300 → 310 (+10)

// Late payment decreases score
await circle.recordLatePayment(userAddress, 1);
// Score: 310 → 290 (-20)

// Default heavily penalizes
await circle.recordDefault(userAddress, 2);
// Score: 290 → 190 (-100)

// Circle completion gives bonus
// (automatically called when circle completes)
// Score: 190 → 205 (+15)
```

## 🔒 Security Features

### 1. Reentrancy Protection
- `nonReentrant` modifier on critical functions
- Checks-Effects-Interactions pattern

### 2. Access Control
- Coordinator-only functions for approvals/rejections
- Only verified circles can interact with ReservePool
- Factory controls circle verification

### 3. Input Validation
- All inputs validated (non-zero, valid ranges)
- Credit-based limits enforced
- Status checks before operations

### 4. State Management
- Clear state transitions (PENDING → ACTIVE → COMPLETED)
- Prevents double payments, double voting
- Tracks payout recipients to prevent duplicates

### 5. Event Logging
- All state changes emit events
- Transparent audit trail
- Easy off-chain indexing

## 📊 Credit Score System

### Score Calculation

| Action | Credit Change |
|--------|--------------|
| On-time payment | +10 |
| Late payment | -20 |
| Default | -100 |
| Circle completion | +15 |

### Credit-Based Limits

When creating a circle, creator's credit score determines:

- **Max Monthly Contribution**: `creditScore × 1 ETH`
- **Max Participants**: `creditScore × 1`
- **Max Total Exposure**: `creditScore × 10 ETH`

Example: Creator with 500 credit score can create a circle with:
- Max 500 ETH monthly contribution
- Max 500 participants
- Max 5,000 ETH total exposure

### Voting Power

Voting weight = participant's credit score

Example:
- Alice (credit: 400) votes → weight: 400
- Bob (credit: 600) votes → weight: 600
- Total votes: 1000

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run Solidity tests
npx hardhat test solidity

# Run TypeScript tests
npx hardhat test nodejs
```

## 📝 Important Notes

1. **No Admin Role**: Only participants with credit-based permissions
2. **Coordinator Role**: Circle creator acts as coordinator, but power is bounded by credit score
3. **Reserve Pool**: Shared across all circles for risk management
4. **Voting Period**: 7 days (configurable in contract)
5. **Excess Funds**: Can be withdrawable or auto-deducted from next month
6. **Defaults**: Heavily penalized, permanently recorded in CreditRegistry

## 🔗 Contract Addresses

After deployment, save your contract addresses:

```javascript
const addresses = {
  creditRegistry: "0x...",
  reservePool: "0x...",
  factory: "0x...",
  // Individual circles created by factory
  circle1: "0x...",
  circle2: "0x..."
};
```

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development](https://ethereum.org/en/developers/)

## ⚠️ Disclaimer

This is a production-quality smart contract system. Always:
- Audit contracts before mainnet deployment
- Test thoroughly on testnets
- Understand all risks before participating
- Start with small amounts

---

**Built with Hardhat 3 Beta and Solidity ^0.8.28**
