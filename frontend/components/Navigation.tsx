"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";
import { useAccount } from "wagmi";

export function Navigation() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const links = [
    { href: "/", label: "Home" },
    { href: "/circles", label: "Browse Circles" },
    ...(isConnected
      ? [
          { href: "/create", label: "Create Circle" },
          { href: "/profile", label: "Profile" },
        ]
      : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              CreditCoin Lending
            </Link>
            <div className="flex gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    pathname === link.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
