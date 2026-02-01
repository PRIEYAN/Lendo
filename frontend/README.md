# Lending Circle Frontend

Production-ready React frontend for the CreditCoin Lending Circle Protocol.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **wagmi + viem** - Ethereum interactions
- **WalletConnect + MetaMask** - Wallet connections
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router v6** - Routing
- **React Hot Toast** - Notifications

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up WalletConnect Project ID:
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Create `.env` file:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. Update contract addresses:
   - After deploying contracts, update `src/contracts/addresses.ts` with deployed addresses

4. Run development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── abi/                    # Contract ABIs (auto-generated from artifacts)
├── contracts/              # Contract addresses and network config
├── hooks/                  # Custom React hooks
│   ├── useWallet.ts       # Wallet connection logic
│   ├── useCredit.ts       # Credit score queries
│   ├── useCircle.ts       # Circle data and actions
│   └── useVoting.ts       # Voting functionality
├── pages/                  # Route pages
│   ├── Landing.tsx
│   ├── CreateCircle.tsx
│   ├── Circles.tsx
│   ├── CircleDetail.tsx
│   └── CreditProfile.tsx
├── store/                  # Zustand state
│   └── useAppStore.ts
├── components/              # Reusable UI components
│   ├── WalletButton.tsx
│   ├── TransactionButton.tsx
│   ├── CreditScoreCard.tsx
│   ├── VotingUI.tsx
│   └── Navigation.tsx
├── lib/                    # Library configurations
│   └── wagmi/
│       └── config.ts
├── utils.ts                # Utility functions
├── router.tsx              # React Router config
├── App.tsx                 # Root component
└── main.tsx                # Entry point
```

## Features

- ✅ Wallet connection (MetaMask + WalletConnect)
- ✅ Network detection and switching
- ✅ Credit score display and tracking
- ✅ Create lending circles
- ✅ Browse and join circles
- ✅ Make contributions
- ✅ Weighted voting system
- ✅ Payout execution
- ✅ Event-based UI updates
- ✅ Toast notifications
- ✅ Error handling

## Environment Variables

Create a `.env` file in the `frontend` directory:

```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Build

```bash
npm run build
```

## Production

After building, serve the `dist` directory with any static file server.
