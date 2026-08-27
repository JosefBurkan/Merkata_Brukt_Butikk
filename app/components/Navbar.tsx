import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">Hjem</Link>
      <Link href="/categories">Våre produkter</Link>
      <Link href="/about">Om oss</Link>
    </nav>
  );
}