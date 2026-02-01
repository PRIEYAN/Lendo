import { create } from "zustand";

interface CreditProfile {
  creditScore: bigint;
  circlesJoined: bigint;
  circlesCompleted: bigint;
  onTimePayments: bigint;
  latePayments: bigint;
  defaults: bigint;
  hasDefaulted: boolean;
}

interface AppState {
  // Wallet state
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  
  // Credit data
  creditProfile: CreditProfile | null;
  
  // Circle cache
  circles: string[]; // Circle addresses
  circleData: Record<string, any>; // Cached circle data
  
  // Actions
  setWallet: (address: string | null, chainId: number | null) => void;
  setCreditProfile: (profile: CreditProfile | null) => void;
  setCircles: (circles: string[]) => void;
  updateCircleData: (address: string, data: any) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  address: null,
  chainId: null,
  creditProfile: null,
  circles: [],
  circleData: {},
  
  setWallet: (address, chainId) =>
    set({
      isConnected: !!address,
      address,
      chainId,
    }),
  
  setCreditProfile: (profile) =>
    set({ creditProfile: profile }),
  
  setCircles: (circles) =>
    set({ circles }),
  
  updateCircleData: (address, data) =>
    set((state) => ({
      circleData: {
        ...state.circleData,
        [address]: data,
      },
    })),
  
  reset: () =>
    set({
      isConnected: false,
      address: null,
      chainId: null,
      creditProfile: null,
      circles: [],
      circleData: {},
    }),
}));
