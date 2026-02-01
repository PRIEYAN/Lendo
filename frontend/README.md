# CreditCoin Lending Circle Frontend

Production-ready Next.js 14 frontend for the CreditCoin Lending Circle Protocol.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- WalletConnect Project ID (get from https://cloud.walletconnect.com)

### Installation

```bash
cd frontend
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your values:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_RPC_URL=https://rpc.creditcoin.network
NEXT_PUBLIC_CHAIN_ID=1337
```

3. Update contract addresses in `lib/contracts/config.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  creditRegistry: "0x...", // Your deployed address
  reservePool: "0x...",     // Your deployed address
  factory: "0x...",         // Your deployed address
};
```

4. Update CreditCoin network configuration in `lib/contracts/config.ts`:
```typescript
export const CREDITCOIN_CHAIN = {
  id: 1337, // Your CreditCoin chain ID
  name: "CreditCoin",
  // ... update RPC URLs and explorer
};
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── circles/           # Circle pages
│   │   ├── page.tsx       # Browse circles
│   │   └── [address]/     # Circle detail page
│   ├── create/            # Create circle page
│   ├── profile/           # Credit profile page
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Wagmi & Query providers
├── components/            # Reusable UI components
│   ├── WalletButton.tsx
│   ├── CreditScoreCard.tsx
│   ├── TransactionButton.tsx
│   ├── VotingUI.tsx
│   └── Navigation.tsx
├── lib/
│   ├── contracts/        # Contract ABIs and config
│   │   ├── config.ts
│   │   └── abis/
│   ├── hooks/            # Custom React hooks
│   │   ├── useCreditScore.ts
│   │   ├── useLendingCircles.ts
│   │   └── useCircleVoting.ts
│   ├── wagmi/            # Wagmi configuration
│   │   └── config.ts
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🎯 Features

### Pages

1. **Landing Page** (`/`)
   - Wallet connection
   - Credit score display
   - Quick actions

2. **Browse Circles** (`/circles`)
   - List all lending circles
   - Filter and search (can be added)
   - Circle cards with key info

3. **Create Circle** (`/create`)
   - Form with validation
   - Credit-based limit checks
   - Transaction handling

4. **Circle Detail** (`/circles/[address]`)
   - Full circle information
   - Join/approve actions
   - Make contributions
   - Voting UI
   - Execute payouts

5. **Credit Profile** (`/profile`)
   - Full credit report
   - Payment history
   - Circle participation
   - Score breakdown

### Components

- **WalletButton**: Connect/disconnect wallet
- **CreditScoreCard**: Display credit score and stats
- **TransactionButton**: Reusable transaction button with states
- **VotingUI**: Complete voting interface with candidates
- **Navigation**: App navigation with wallet status

### Hooks

- `useCreditScore`: Get credit score for address
- `useCreditProfile`: Get full credit profile
- `useLendingCircles`: Fetch and manage circles
- `useCircleVoting`: Voting system hooks

## 🔧 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **wagmi** + **viem** (Ethereum interactions)
- **@tanstack/react-query** (Data fetching)
- **TailwindCSS** (Styling)
- **WalletConnect** + **MetaMask** (Wallet connections)

## 🔐 Security Features

- Input validation before transactions
- Network detection
- Wallet connection checks
- Error handling and user feedback
- Transaction state management
- Revert reason display

## 📝 Notes

- All contract interactions use wagmi hooks
- Contract ABIs are typed with TypeScript
- State is managed via React Query caching
- No backend server - fully decentralized
- Smart contracts are the source of truth

## 🐛 Troubleshooting

### Wallet Connection Issues

- Ensure MetaMask is installed
- Check network configuration matches CreditCoin
- Verify WalletConnect Project ID is set

### Transaction Failures

- Check wallet has sufficient balance
- Verify network is correct
- Check contract addresses are correct
- Review error messages in UI

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## 📚 Next Steps

1. Update contract addresses after deployment
2. Configure CreditCoin network details
3. Get WalletConnect Project ID
4. Test on testnet first
5. Customize UI/UX as needed

## 🤝 Contributing

This is a production-ready frontend. Make sure to:
- Test all transactions on testnet
- Verify contract addresses
- Update network configuration
- Test wallet connections

---

Built with ❤️ for CreditCoin Lending Circles
