import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-purple-700 px-8 py-4 shadow-md">
      <nav aria-label="Main navigation" className="flex gap-6">
        <Link href="/" className="font-semibold text-white hover:text-green-300">
          Home
        </Link>
        <Link href="/transactions" className="font-semibold text-white hover:text-green-300">
          Transactions
        </Link>
        <Link href="/wallet" className="font-semibold text-white hover:text-green-300">
          Wallet
        </Link>
      </nav>
    </header>
  );
}
