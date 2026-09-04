"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type SearchBarProps = {
  className?: string;
};

export default function SearchBar({
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  /*
   * Live search.
   *
   * Every time the user types, we wait 300ms.
   * If they type again before 300ms has passed,
   * the previous timer is cancelled.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      const currentSearch =
        searchParams.get("search") ?? "";

      const newSearch = search.trim();

      /*
       * Do nothing if the URL already contains
       * the same search value.
       */
      if (newSearch === currentSearch) {
        return;
      }

      /*
       * Add the search parameter if something
       * has been entered.
       */
      if (newSearch) {
        params.set("search", newSearch);
      }

      /*
       * Remove the search parameter when
       * the input is empty.
       */
      else {
        params.delete("search");
      }

      const queryString = params.toString();

      router.replace(
        queryString
          ? `${pathname}?${queryString}`
          : pathname,
        {
          scroll: false,
        }
      );
    }, 300);

    /*
     * Cancel the previous timer if the user
     * types another character before 300ms.
     */
    return () => {
      clearTimeout(timer);
    };
  }, [
    search,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <div
      className={`relative w-full ${className}`}
    >
      <input
        type="text"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Søk etter produkt..."
        className="
          h-14
          w-full
          rounded-2xl
          border
          border-black/20
          bg-card
          px-5
          pr-14
          text-base
          caret-white
          outline-none
          transition-all
          duration-200
          placeholder:text-black

          hover:border-black/40

          focus:border-black
          focus:ring-2
          focus:ring-black/10
        "
      />

      {/* Search icon */}
      <div
        className="
          pointer-events-none
          absolute
          right-5
          top-1/2
          -translate-y-1/2
          text-black
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
          />

          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
}