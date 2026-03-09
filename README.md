# LendingCircle

### Decentralized Credit-Based Lending Circle Protocol

LendingCircle brings the centuries-old practice of rotating savings and credit associations (ROSCAs) to the blockchain. Participants form trusted circles, make monthly contributions, and vote on payout recipients — all governed transparently on-chain, backed by a credit scoring system that incentivizes reliable behavior.

![Architecture Diagram](assets/img.png)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Backend](#backend)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Credit Score System](#credit-score-system)
- [Security](#security)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

LendingCircle is a full-stack decentralized application built on Ethereum. Users connect their wallets, form or join lending circles, and participate in a structured monthly savings and payout cycle. Every action — from joining a circle to casting a vote — is recorded on-chain, creating a trustless and auditable system accessible to anyone with a Web3 wallet.

The protocol is composed of four Solidity smart contracts, a Next.js 14 frontend, and a Node.js/Express backend for real-time communication.

---

## Key Features

**Credit-Based System** — All participants carry a credit score between 0 and 1000 that governs their contribution limits, circle creation permissions, and voting weight.

**Weighted Voting** — Monthly payout recipients are elected by participants, with votes weighted proportionally to credit score.

**Reserve Pool** — A shared protocol-level reserve pool absorbs risk across all active circles, providing a safety net for edge-case scenarios.

**Circle Management** — Coordinators can configure circles with custom contribution amounts, duration, participant limits, and reserve percentages.

**Real-Time Chat** — WebSocket-powered in-circle messaging allows participants to discuss and deliberate before voting.

**Automatic Credit Tracking** — Credit scores are updated on-chain in response to payment behavior — no manual intervention required.

**Default Handling** — Built-in logic manages late payments and defaults, updating credit scores and triggering reserve pool interventions where necessary.

---

## Project Structure

```
LendingCircle/
├── blockchain/          # Smart contracts (Hardhat)
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   └── ignition/       # Hardhat Ignition modules
├── frontend/           # Next.js web application
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   └── lib/            # Utilities and hooks
├── backend/            # Express + WebSocket server
│   └── server.js       # Main server file
└── assets/             # Images and documentation assets
```

---

## Architecture

The protocol is built around four smart contracts that work in concert:

| Contract | Role |
|---|---|
| `CreditRegistry` | Tracks credit scores for all participants across the platform |
| `ReservePool` | Manages reserve funds contributed by all circles |
| `LendingCircleFactory` | Factory contract that deploys new circle instances |
| `LendingCircle` | Individual circle logic: contributions, voting, and payouts |

Each circle operates as an independent contract but shares the `CreditRegistry` and `ReservePool` at the protocol level. When a participant makes a monthly contribution, a configurable percentage flows into the circle's payout pool, while the remainder is deposited into the reserve pool for system-wide risk management.

![Circle Details](assets/img1.png)

---

## Smart Contracts

### CreditRegistry.sol

The central credit ledger for the entire protocol. Credit scores begin at 300 upon registration and are updated automatically based on on-chain behavior.

| Event | Score Impact |
|---|---|
| On-time payment | +10 |
| Late payment | -20 |
| Default | -100 |
| Circle completion | +15 |

Scores are bounded between 0 and 1000 and cannot be manipulated externally.

---

### ReservePool.sol

Holds reserve funds deposited from all active circles. Access is restricted — only verified `LendingCircle` contract instances can deposit to or withdraw from the pool. The reserve acts as a protocol-wide buffer if a circle requires additional liquidity for a scheduled payout.

---

### LendingCircleFactory.sol

Deploys new `LendingCircle` instances with enforced credit-based constraints. A minimum credit score of 300 is required to create a circle. The factory applies the following limits at creation time:

| Parameter | Limit |
|---|---|
| Max contribution | 1 ETH per credit point |
| Max participants | 1 per credit point |
| Max exposure | 10 ETH per credit point |

---

### LendingCircle.sol

The core contract managing the full lifecycle of a circle:

- Participant join requests and coordinator approvals
- Monthly contribution collection
- Voting on payout recipients (weighted by credit score)
- Payout execution to the elected winner
- Excess fund distribution at circle completion

![Details](assets/img2.png)

---

## Frontend

Built with **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**, **wagmi**, and **viem**.

### Pages

| Route | Description |
|---|---|
| `/` | Landing page — wallet connection, credit score display, quick actions |
| `/circles` | Browse all available lending circles |
| `/create` | Create a new lending circle with a guided form |
| `/circles/[address]` | Circle detail view — contributions, voting UI, and chat |
| `/profile` | Credit profile — full report and payment history |

### Key Components

- `WalletButton` — Connect and disconnect wallet with status display
- `CreditScoreCard` — Visual credit score display with tier indicators
- `TransactionButton` — Reusable button with loading, confirmation, and error states
- `VotingUI` — Full voting interface showing candidates and current vote tallies
- `ChatBox` — Real-time WebSocket chat embedded in circle detail pages

![Dashboard](assets/img11.png)

![Create Circle Form](assets/imgg.png)

---

## Backend

An **Express.js** server with **WebSocket** support provides real-time functionality and off-chain computation support.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/calculate-winner` | Calculates the payout winner for a given month with tie-breaking logic |
| `GET` | `/api/chat/:circleAddress` | Retrieves chat message history for a circle |

### WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | Join a circle's chat room |
| `chat` | Client → Server | Send a message to the room |
| `message` | Server → Client | Receive a message from another participant |

> Note: Chat messages are currently stored in-memory. For production deployments, a persistent database (e.g., PostgreSQL or Redis) should be used.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Hardhat for smart contract development
- Access to an Ethereum network (local, testnet, or mainnet)

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd LendingCircle
```

**2. Install blockchain dependencies**
```bash
cd blockchain
npm install
```

**3. Install frontend dependencies**
```bash
cd ../frontend
npm install
```

**4. Install backend dependencies**
```bash
cd ../backend
npm install
```

### Configuration

**Blockchain** — Create a `.env` file in `blockchain/`:
```env
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

**Frontend** — After deployment, update the deployed contract addresses in:
```
frontend/lib/contracts/config.ts
```

**Backend** — Optionally create a `.env` file in `backend/`:
```env
PORT=3001
```

### Deployment

**1. Deploy smart contracts**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network <network>
```

**2. Update frontend config** with the addresses output by the deployment script.

**3. Start the backend server**
```bash
cd backend
npm start
```

**4. Start the frontend**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Usage

### Creating a Circle

1. Connect your wallet on the landing page
2. Navigate to **Create Circle**
3. Configure the circle parameters:
   - Monthly contribution amount (ETH)
   - Duration in months
   - Minimum and maximum participants
   - Reserve percentage (0–100%)
   - Excess distribution method
4. Submit the transaction and wait for on-chain confirmation

### Joining a Circle

1. Browse circles at `/circles`
2. Select a circle and review its terms
3. Click **Request to Join** if you meet the eligibility requirements
4. Wait for the coordinator to approve your membership request

### Making Contributions

1. Navigate to your circle's detail page
2. Click **Make Contribution** for the current month
3. Approve and confirm the transaction in your wallet

### Voting

1. During the voting period, open your circle's detail page
2. Review all nominated candidates and their credit scores
3. Cast your vote — your voting weight is proportional to your credit score

### Executing Payouts

1. After voting closes, any participant can trigger payout execution
2. Click **Execute Payout** on the circle detail page
3. The on-chain winner receives the pool balance automatically
4. The circle advances to the next contribution period

---

## Credit Score System

Credit scores are the foundation of trust in the LendingCircle protocol. They determine:

- Maximum contribution amounts you can commit to
- How many participants you may allow in circles you create
- Your voting weight in monthly payout elections
- Whether you are eligible to create new circles (minimum score: 300)

Scores are calculated and stored entirely on-chain, making them transparent, tamper-proof, and portable across every circle you participate in.

---

## Security

- All contracts implement reentrancy guards to prevent re-entrancy attacks
- Only verified `LendingCircle` instances can interact with the `ReservePool`
- Credit-based limits enforce hard caps on contribution and exposure amounts
- Coordinator permissions are narrowly scoped to approval/rejection and payment recording
- All voting is conducted on-chain, ensuring full transparency and auditability
- Always test on a testnet before any mainnet deployment

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/sanjayrohith">
        <img src="https://github.com/sanjayrohith.png" width="80" height="80" style="border-radius:50%" alt="sanjayrohith"/><br/>
        <sub><b>sanjayrohith</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/kiruthick-699">
        <img src="https://github.com/kiruthick-699.png" width="80" height="80" style="border-radius:50%" alt="kiruthick-699"/><br/>
        <sub><b>kiruthick-699</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
