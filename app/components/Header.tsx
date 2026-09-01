import Link from "next/link";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="flex min-h-[72px] w-full items-center justify-between gap-4 bg-header px-5 md:px-[6vw]">
      <Link
        href="/"
        className="whitespace-nowrap text-base font-bold md:text-3xl"
      >
        MERKATÅ BRUKTBUTIKK
      </Link>

      <Navbar />
    </header>
  );
}