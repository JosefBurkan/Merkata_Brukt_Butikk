import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/produkter">Våre produkter</Link>
      <Link href="/about">Om oss</Link>
    </nav>
  );
}