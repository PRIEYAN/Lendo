# Frontend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up WalletConnect:**
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Create `.env` file in `frontend/` directory:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Update contract addresses:**
   - After deploying contracts, update `src/contracts/addresses.ts` with the deployed addresses:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     creditRegistry: "0x...", // Your deployed CreditRegistry address
     reservePool: "0x...",    // Your deployed ReservePool address
     factory: "0x...",         // Your deployed LendingCircleFactory address
   };
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
frontend/
├── src/
│   ├── abi/                    # Contract ABIs (from artifacts)
│   │   ├── CreditRegistry.json
│   │   ├── CreditRegistry.ts
│   │   ├── LendingCircleFactory.json
│   │   ├── LendingCircleFactory.ts
│   │   ├── LendingCircle.json
│   │   ├── LendingCircle.ts
│   │   └── index.ts
│   ├── contracts/              # Contract configuration
│   │   └── addresses.ts        # Update with deployed addresses
│   ├── hooks/                  # Custom React hooks
│   │   ├── useWallet.ts       # Wallet connection
│   │   ├── useCredit.ts       # Credit score queries
│   │   ├── useCircle.ts       # Circle data & actions
│   │   └── useVoting.ts       # Voting functionality
│   ├── pages/                  # Route pages
│   │   ├── Landing.tsx
│   │   ├── CreateCircle.tsx
│   │   ├── Circles.tsx
│   │   ├── CircleDetail.tsx
│   │   └── CreditProfile.tsx
│   ├── store/                  # Zustand state management
│   │   └── useAppStore.ts
│   ├── components/              # Reusable components
│   │   ├── WalletButton.tsx
│   │   ├── TransactionButton.tsx
│   │   ├── CreditScoreCard.tsx
│   │   ├── VotingUI.tsx
│   │   └── Navigation.tsx
│   ├── lib/                    # Library configs
│   │   └── wagmi/
│   │       └── config.ts
│   ├── utils.ts                # Utility functions
│   ├── router.tsx              # React Router config
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Features Implemented

✅ **Wallet Connection**
- MetaMask integration
- WalletConnect support
- Network detection and switching
- Auto-disconnect on wrong network

✅ **Credit System**
- Real-time credit score display
- Credit profile with full history
- Event-based updates

✅ **Circle Management**
- Create new lending circles
- Browse all circles
- Join circle requests
- Approve/reject participants (creator)

✅ **Contributions**
- Make monthly contributions
- View pool balance
- Track payment history

✅ **Voting System**
- View eligible candidates
- Weighted voting by credit score
- Real-time vote counts
- Execute payouts after voting

✅ **UI/UX**
- Toast notifications
- Loading states
- Error handling
- Responsive design
- Optimistic UI updates

## Environment Variables

Create `.env` in the `frontend/` directory:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Notes

- Contract addresses must be updated in `src/contracts/addresses.ts` after deployment
- ABIs are automatically copied from blockchain artifacts
- All contract interactions use wagmi hooks for type safety
- State is managed with Zustand for global app state
- React Query handles caching and refetching of contract data
