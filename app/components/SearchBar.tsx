"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (search.trim()) {
                params.set("search", search);
            } else {
                params.delete("search");
            }

            router.push(`?${params.toString()}`);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    return (

        <div className="search-container">
            <input className="search-input"
                type="text"
                placeholder="Søk etter produkt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
        </div>
    );
}