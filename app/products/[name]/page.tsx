import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import SearchBar from "@/app/components/SearchBar";
import Filter from "@/app/components/Filter";
import ModalButton from "@/app/components/ModalButton";

import { categoryMap } from "@/lib/categories";

// params brukes når man går inn på kategorien.
// searchParams brukes for søk og filtrering.
export default async function Products({
    params,
    searchParams,
}: {
    params: Promise<{ name: string }>;
    searchParams: Promise<{
        search?: string;
        maxPrice?: string;
        minPrice?: string;
        sub_category?: string;
    }>;
}) {
    const { name } = await params;

    const {
        search,
        maxPrice,
        minPrice,
        sub_category,
    } = await searchParams;

    // For modal

    // Gjør f.eks. "elektronikk" om til "Elektronikk"
    // og "mobler" om til "Møbler".
    const category = categoryMap[name];

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Hvis URL-en inneholder en kategori som ikke finnes
    if (!category) {
        return (
            <main className="p-10 text-center">
                <h1 className="text-3xl font-bold">
                    Kategorien finnes ikke
                </h1>
            </main>
        );
    }

    let query = supabase
        .from("Product")
        .select("*")
        .eq("category", category);

    // Søk på produktnavn
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    // Makspris
    if (maxPrice) {
        query = query.lte(
            "price",
            Number(maxPrice)
        );
    }

    // Minimumspris
    if (minPrice) {
        query = query.gte(
            "price",
            Number(minPrice)
        );
    }

    // Underkategori
    if (sub_category) {
        query = query.eq(
            "sub_category",
            sub_category
        );
    }

    const {
        data: products,
        error,
    } = await query;

    if (error) {
        console.error(error);
    }

    return (
        <main className="transform-none
        ">
            {/* Breadcrumb */}
            <p className="p-5 text-black">
                Forside / Produkter / {category}
            </p>

            {/* Filter */}
            <div className="filter-container">
                <div className="filter">
                    <Filter name={name} />
                </div>
            </div>

            {/* Søk */}
            <div className="-mt-50 flex items-center justify-center">
                <SearchBar className="text-center" />
            </div>

            {/* Kategori */}
            <h1 className="p-5 text-center text-3xl font-bold">
                {category}
            </h1>

            {/* Ingen produkter */}
            {products?.length === 0 && (
                <p className="mt-10 text-center text-black">
                    Ingen produkter funnet i denne kategorien.
                </p>
            )}

            {/* Produkter */}
            <div className="product-list mx-auto grid grid-cols-1 justify-items-center gap-50 lg:grid-cols-3 transform-none">
                {products?.map((product) => (
                    <ModalButton key={product.id} product={product}>
                        <div className="product-card">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-[200px] w-full shrink-0 rounded-t-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-[200px] items-center justify-center">
                                    Ingen bilde
                                </div>
                            )}

                            <p className="text-center text-2xl font-bold">
                                {product.name}
                            </p>

                            <p className="text-center text-lg font-bold">
                                {product.price},-
                            </p>
                        </div>
                    </ModalButton>
                ))}
            </div>
        </main>
    );
}