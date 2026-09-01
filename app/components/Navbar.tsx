import Link from "next/link";

export default function Navbar() {
  const linkStyle =
    "relative pb-1 text-[13px] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full md:text-[15px]";

  return (
    <nav className="flex items-center gap-4 md:gap-8">
      <Link href="/" className={linkStyle}>
        Hjem
      </Link>

      <Link href="/categories" className={linkStyle}>
        Våre produkter
      </Link>

      <Link href="/about" className={linkStyle}>
        Om oss
      </Link>
    </nav>
  );
}