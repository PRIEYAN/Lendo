import { RouterProvider } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { router } from "./router";
import { Navigation } from "./components/Navigation";
import { wagmiConfig } from "./lib/wagmi/config";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <RouterProvider router={router} />
          </main>
          <Toaster position="top-right" />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
