import Link from "next/link";
import { cookies } from "next/headers";

import { createClient } from "@/supabase/server";

import SearchBar from "@/app/components/SearchBar";
import Filter from "@/app/components/Filter";
import { categoryMap } from "@/lib/categories";

import ModalButton from "@/app/components/ModalButton";

type ProductsPageProps = {
  params: Promise<{
    name: string;
  }>;

  searchParams: Promise<{
    search?: string;
    maxPrice?: string;
    minPrice?: string;
    sub_category?: string;
  }>;
};

export default async function Products({
  params,
  searchParams,
}: ProductsPageProps) {
  const { name } = await params;

  const {
    search,
    maxPrice,
    minPrice,
    sub_category,
  } = await searchParams;

  /*
   * Converts the URL slug to the actual database category.
   *
   * Example:
   * elektronikk -> Elektronikk
   * mobler      -> Møbler
   */
  const category = categoryMap[name];

  /*
   * Invalid category.
   */
  if (!category) {
    return (
      <main className="flex flex-1 items-center justify-center bg-main px-6 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Kategorien finnes ikke
          </h1>

          <p className="mt-4 opacity-75">
            Kategorien du prøver å åpne finnes ikke.
          </p>

          <Link
            href="/categories"
            className="mt-6 inline-block rounded-lg bg-card px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Tilbake til kategorier
          </Link>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  /*
   * Start query.
   */
    let query;

    if (category === "Alt")
    {
        query = supabase
        .from("Product")
        .select("*")
        .order("created_at", {
          ascending: false,
        });
    }
    else 
    {
        query = supabase
        .from("Product")
        .select("*")
        .eq("category", category)
        .order("created_at", {
          ascending: false,
        });
    }


  /*
   * Search by product name.
   */
  if (search) {
    query = query.ilike(
      "name",
      `%${search}%`
    );
  }

  /*
   * Minimum price.
   */
  if (minPrice) {
    const parsedMinPrice = Number(minPrice);

    if (Number.isFinite(parsedMinPrice)) {
      query = query.gte(
        "price",
        parsedMinPrice
      );
    }
  }

  /*
   * Maximum price.
   */
  if (maxPrice) {
    const parsedMaxPrice = Number(maxPrice);

    if (Number.isFinite(parsedMaxPrice)) {
      query = query.lte(
        "price",
        parsedMaxPrice
      );
    }
  }

  /*
   * Sub category.
   */
  if (sub_category) {
    query = query.eq(
      "sub_category",
      sub_category
    );
  }

  /*
   * Fetch products.
   */
  const {
    data: products,
    error,
  } = await query;

  if (error) {
    console.error(
      "Error fetching products:",
      error
    );
  }

  return (
    <main className="flex-1 bg-main">

      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 lg:px-12">

        {/* =========================
            BREADCRUMB
        ========================= */}

        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="opacity-70 transition hover:opacity-100"
          >
            Forside
          </Link>

          <span className="opacity-40">
            /
          </span>

          <Link
            href="/categories"
            className="opacity-70 transition hover:opacity-100"
          >
            Produkter
          </Link>

          <span className="opacity-40">
            /
          </span>

          <span className="font-semibold">
            {category}
          </span>
        </nav>


        {/* ========================= 
            PAGE HEADER
        ========================= */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] opacity-65">
            Våre produkter
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {category}
              </h1>

              <p className="mt-3 max-w-xl leading-relaxed opacity-75">
                Utforsk vårt utvalg innen {category.toLowerCase()}.
              </p>
            </div>

            {!error && (
              <p className="text-sm opacity-70">
                {products?.length ?? 0}{" "}
                {(products?.length ?? 0) === 1
                  ? "produkt"
                  : "produkter"}
              </p>
            )}

          </div>
        </div>


        {/* =========================
            SHOP LAYOUT
        ========================= */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">

          {/* =========================
              FILTER SIDEBAR
          ========================= */}

          <aside>
            <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-sm lg:sticky lg:top-6">

              <div className="mb-5">
                <h2 className="text-lg font-bold">
                  Filtrer
                </h2>

                <p className="mt-1 text-sm opacity-70">
                  Begrens produktene
                </p>
              </div>

              <Filter name={name} />

            </div>
          </aside>


          {/* =========================
              PRODUCTS
          ========================= */}

          <section>

            {/* Search */}
            <div className="mb-8">
                <SearchBar className="w-full" />
            </div>

            {/* Database error */}
            {error && (
              <div className="rounded-xl border border-white/10 bg-card p-8 text-center">
                <h2 className="text-xl font-bold">
                  Kunne ikke hente produkter
                </h2>

                <p className="mt-2 text-sm opacity-75">
                  Prøv igjen senere.
                </p>
              </div>
            )}


            {/* No products */}
            {!error &&
              products?.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-card px-6 py-16 text-center">

                  <h2 className="text-xl font-bold">
                    Ingen produkter funnet
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-75">
                    Vi fant ingen produkter som passer med søket
                    eller filtrene dine.
                  </p>

                  <Link
                    href={`/products/${name}`}
                    className="mt-6 inline-block rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20"
                  >
                    Nullstill søk og filter
                  </Link>

                </div>
              )}


            {/* Product grid */}
            {!error &&
              products &&
              products.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {products.map((product) => (
                        <ModalButton key={product.id} product={product}>
                    <article
                      key={product.id}
                      className="
                        group
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-card
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-white/20
                        hover:shadow-xl
                      "
                    >

                      {/* Product image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">

                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">

                            <div className="text-center opacity-60">
                              <div className="mb-2 text-3xl">
                                ◻
                              </div>

                              <p className="text-sm">
                                Ingen bilde
                              </p>
                            </div>

                          </div>
                        )}

                      </div>


                      {/* Product information */}
                      <div className="p-5">

                        {product.sub_category && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-60">
                            {product.sub_category}
                          </p>
                        )}

                        <h2 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-snug">
                          {product.name}
                        </h2>

                        <div className="mt-5 flex items-center justify-between">

                          <p className="text-xl font-bold">
                            {product.price},-
                          </p>

                          <span
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-white/10
                              transition-all
                              duration-300
                              group-hover:translate-x-1
                              group-hover:bg-white
                              group-hover:text-card
                            "
                          >
                            →
                          </span>

                        </div>

                      </div>

                            </article>
                    </ModalButton>
                  ))}

                </div>
              )}

          </section>
        </div>

      </div>
    </main>
  );
}