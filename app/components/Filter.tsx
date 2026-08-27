"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SubCategory = {
    id: number;
    name: string;
    category: string;
};

type FilterProps = {
    name: string;
};

// URL-navnet er litt annerledes enn navnet som lagres i databasen.
// Eksempel:
// /products/elektronikk -> Elektronikk
const categoryMap: Record<string, string> = {
    elektronikk: "Elektronikk",
    mobler: "Møbler",
    fritid: "Fritid",
    klaer: "Klær",
    musikk: "Musikk",
    annet: "Annet",
};

export default function Filter({ name }: FilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Underkategoriene som hentes fra databasen
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    // Brukes mens underkategoriene lastes inn
    const [loading, setLoading] = useState(true);

    // Hvis URL-en er "elektronikk",
    // blir category "Elektronikk"
    const category = categoryMap[name];


    // =========================
    // FETCH SUBCATEGORIES
    // =========================

    useEffect(() => {
        async function fetchSubCategories() {
            // Hvis kategorien i URL-en ikke finnes
            if (!category) {
                setSubCategories([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(
                    `/api/subcategories?category=${encodeURIComponent(category)}`
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        "Kunne ikke hente underkategorier:",
                        data.error
                    );

                    setSubCategories([]);
                    return;
                }

                setSubCategories(data);
            } catch (error) {
                console.error(
                    "Kunne ikke hente underkategorier:",
                    error
                );

                setSubCategories([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSubCategories();
    }, [category]);


    // =========================
    // PRICE FILTER
    // =========================

    function priceChange(value: string) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set("maxPrice", value);
        } else {
            params.delete("maxPrice");
        }

        router.push(`?${params.toString()}`);
    }


    // =========================
    // SUBCATEGORY FILTER
    // =========================

    function subCategoryChange(value: string) {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set("sub_category", value);
        } else {
            params.delete("sub_category");
        }

        router.push(`?${params.toString()}`);
    }


    return (
        <main>

            {/* Price filter */}
            <div>
                <select
                    onChange={(event) =>
                        priceChange(event.target.value)
                    }
                    value={
                        searchParams.get("maxPrice") ?? ""
                    }
                >
                    <option value="">
                        Alle priser
                    </option>

                    <option value="500">
                        Under 500 kr
                    </option>

                    <option value="1000">
                        Under 1000 kr
                    </option>

                    <option value="2000">
                        Under 2000 kr
                    </option>
                </select>
            </div>


            {/* Subcategory filter */}
            <div>
                <select
                    onChange={(event) =>
                        subCategoryChange(event.target.value)
                    }
                    value={
                        searchParams.get("sub_category") ?? ""
                    }
                    disabled={loading}
                >
                    <option value="">
                        {loading
                            ? "Henter underkategorier..."
                            : "Alle underkategorier"}
                    </option>

                    {subCategories.map((subCategory) => (
                        <option
                            key={subCategory.id}
                            value={subCategory.name}
                        >
                            {subCategory.name}
                        </option>
                    ))}
                </select>
            </div>

        </main>
    );
}