import Link from "next/link";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="logo">
        MERKATÅ BRUKTBUTIKK
      </Link>

      <Navbar />
    </header>
  );
}