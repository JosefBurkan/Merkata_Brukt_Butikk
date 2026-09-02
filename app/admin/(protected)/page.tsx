import Link from "next/link";
import { cookies } from "next/headers";

import { createClient } from "@/supabase/server";

import LogoutButton from "@/app/components/LogoutButton";
import DeleteProductButton from "@/app/components/DeleteProductButton";
import AdminProductFilters from "@/app/components/AdminProductFilters";

const PRODUCTS_PER_PAGE = 20;

type AdminPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sub_category?: string;
    page?: string;
  }>;
};

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const {
    search = "",
    category = "",
    sub_category = "",
    page = "1",
  } = await searchParams;


  // =========================
  // PAGE NUMBER
  // =========================

  const parsedPage = Number(page);

  const currentPage =
    Number.isInteger(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;


  // =========================
  // SUPABASE
  // =========================

  const cookieStore =
    await cookies();

  const supabase =
    createClient(cookieStore);


  // =========================
  // PAGINATION RANGE
  // =========================

  const from =
    (currentPage - 1) *
    PRODUCTS_PER_PAGE;

  const to =
    from +
    PRODUCTS_PER_PAGE -
    1;


  // =========================
  // PRODUCT QUERY
  // =========================

  let query = supabase
    .from("Product")
    .select("*", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    });


  // Search by product name
  if (search.trim()) {
    query = query.ilike(
      "name",
      `%${search.trim()}%`
    );
  }


  // Filter by category
  if (category) {
    query = query.eq(
      "category",
      category
    );
  }


  // Filter by subcategory
  if (sub_category) {
    query = query.eq(
      "sub_category",
      sub_category
    );
  }


  // Only fetch current page
  query = query.range(
    from,
    to
  );


  // =========================
  // FETCH PRODUCTS
  // =========================

  const {
    data: products,
    error: productsError,
    count,
  } = await query;

  if (productsError) {
    console.error(
      "Error fetching admin products:",
      productsError
    );
  }


  // =========================
  // PAGINATION INFORMATION
  // =========================

  const totalProducts =
    count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalProducts /
        PRODUCTS_PER_PAGE
    )
  );

  const firstProduct =
    totalProducts === 0
      ? 0
      : from + 1;

  const lastProduct =
    Math.min(
      from +
        PRODUCTS_PER_PAGE,
      totalProducts
    );


  // =========================
  // CREATE PAGE URL
  // =========================

  function createPageUrl(
    pageNumber: number
  ) {
    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (sub_category) {
      params.set(
        "sub_category",
        sub_category
      );
    }

    params.set(
      "page",
      String(pageNumber)
    );

    return `/admin?${params.toString()}`;
  }


  return (
    <main className="min-h-screen flex-1 bg-main text-gray-900">

      <div className="mx-auto w-full max-w-6xl px-6 py-10">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-gray-600">
              Administrasjon
            </p>

            <h1 className="text-3xl font-bold">
              Adminpanel
            </h1>

            <p className="mt-2 text-gray-600">
              Administrer produkter i butikken.
            </p>

          </div>

          <LogoutButton />

        </div>


        {/* =========================
            ADMIN ACTIONS
        ========================= */}

        <div className="mb-10 flex flex-wrap gap-3">

          <Link
            href="/admin/products/new"
            className="
              rounded-xl
              bg-orange-600
              px-5
              py-3
              font-semibold
              text-white
              shadow-sm
              transition
              duration-200

              hover:-translate-y-0.5
              hover:bg-orange-700
              hover:shadow-md
            "
          >
            + Legg til produkt
          </Link>


          <Link
            href="/admin/subcategories"
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-5
              py-3
              font-semibold
              text-gray-700
              shadow-sm
              transition
              duration-200

              hover:-translate-y-0.5
              hover:bg-gray-50
              hover:shadow-md
            "
          >
            Administrer underkategorier
          </Link>

        </div>


        {/* =========================
            PRODUCTS
        ========================= */}

        <section>

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Produkter
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {totalProducts}{" "}
                {totalProducts === 1
                  ? "produkt"
                  : "produkter"}
              </p>

            </div>


            {totalProducts > 0 && (
              <p className="text-sm text-gray-600">
                Viser{" "}
                {firstProduct}–
                {lastProduct} av{" "}
                {totalProducts}
              </p>
            )}

          </div>


          {/* =========================
              SEARCH + FILTERS
          ========================= */}

          <AdminProductFilters
            initialSearch={
              search
            }
            initialCategory={
              category
            }
            initialSubCategory={
              sub_category
            }
          />


          {/* =========================
              ERROR
          ========================= */}

          {productsError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              Kunne ikke hente produktene.
            </div>
          )}


          {/* =========================
              NO PRODUCTS
          ========================= */}

          {!productsError &&
            products?.length ===
              0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                <h3 className="text-xl font-semibold">
                  Ingen produkter funnet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Prøv et annet søk eller fjern filtrene.
                </p>


                {(search ||
                  category ||
                  sub_category) && (
                  <Link
                    href="/admin"
                    className="
                      mt-5
                      inline-block
                      rounded-lg
                      bg-gray-900
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition

                      hover:bg-gray-700
                    "
                  >
                    Nullstill filter
                  </Link>
                )}

              </div>
            )}


          {/* =========================
              PRODUCT LIST
          ========================= */}

          {!productsError &&
            products &&
            products.length > 0 && (
              <div className="mt-6 grid gap-4">

                {products.map(
                  (product) => (
                    <div
                      key={
                        product.id
                      }
                      className="
                        flex
                        flex-col
                        gap-5
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        duration-200

                        hover:border-gray-300
                        hover:shadow-md

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      {/* Product information */}
                      <div className="flex min-w-0 items-center gap-5">

                        {/* Image */}
                        {product.image_url ? (
                          <img
                            src={
                              product.image_url
                            }
                            alt={
                              product.name
                            }
                            className="h-20 w-20 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-center text-xs text-gray-400">
                            Ingen
                            <br />
                            bilde
                          </div>
                        )}


                        {/* Information */}
                        <div className="min-w-0">

                          <h3 className="truncate text-lg font-semibold">
                            {
                              product.name
                            }
                          </h3>


                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">

                            <span className="font-medium text-gray-700">
                              {
                                product.price
                              }{" "}
                              kr
                            </span>

                            <span>
                              {
                                product.category
                              }
                            </span>


                            {product.sub_category && (
                              <span>
                                {
                                  product.sub_category
                                }
                              </span>
                            )}


                            <span className="text-gray-400">
                              ID:{" "}
                              {
                                product.id
                              }
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-3">

                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-gray-700
                            transition

                            hover:bg-gray-50
                          "
                        >
                          Rediger
                        </Link>


                        <DeleteProductButton
                          productId={
                            product.id
                          }
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            )}


          {/* =========================
              PAGINATION
          ========================= */}

          {!productsError &&
            totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">

                {/* Previous */}
                {currentPage > 1 ? (
                  <Link
                    href={createPageUrl(
                      currentPage -
                        1
                    )}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    ← Forrige
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-300">
                    ← Forrige
                  </span>
                )}


                {/* Current page */}
                <p className="text-sm text-gray-600">
                  Side{" "}
                  <span className="font-semibold text-gray-900">
                    {
                      currentPage
                    }
                  </span>{" "}
                  av{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </p>


                {/* Next */}
                {currentPage <
                totalPages ? (
                  <Link
                    href={createPageUrl(
                      currentPage +
                        1
                    )}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Neste →
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-300">
                    Neste →
                  </span>
                )}

              </div>
            )}

        </section>

      </div>

    </main>
  );
}