import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b px-8 py-4">
      <nav aria-label="Main navigation" className="flex gap-6">
        <Link href="/" className="font-semibold hover:underline">
          Home
        </Link>
        <Link href="/transactions" className="font-semibold hover:underline">
          Transactions
        </Link>
        <Link href="/wallet" className="font-semibold hover:underline">
          Wallet
        </Link>
      </nav>
    </header>
  );
}
