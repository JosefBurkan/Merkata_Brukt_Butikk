import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import LogoutButton from "@/app/components/LogoutButton";
import DeleteProductButton from "@/app/components/DeleteProductButton";
import Link from "next/link";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  // Fetch all products from the Product table.
  // Products are ordered by creation date so the newest products appear first.
  const { data: products, error: productsError } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error(productsError);
  }

  return (
    // Main admin page container
    <main className="min-h-screen bg-[var(--main)] text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Admin page header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Adminpanel</h1>

            <p className="mt-1 text-gray-600">
              Administrer produkter i butikken
            </p>
          </div>

          {/* Signs the current admin out of Supabase */}
          <LogoutButton />
        </div>

        {/* Link to the page for creating a new product */}
        {/* Admin actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          {/* Create a new product */}
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            + Legg til produkt
          </Link>

          {/* Manage subcategories */}
          <Link
            href="/admin/subcategories"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Administrer underkategorier
          </Link>
        </div>

        {/* Product management section */}
        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Produkter
          </h2>

          {/* Display each product as its own card */}
          <div className="grid gap-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Basic product information */}
                <div className="flex items-center gap-5">
                  {/* Display the product image if one exists */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      Ingen bilde
                    </div>
                  )}

                  {/* Product information */}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>{product.price} kr</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>

                {/* Actions for editing or deleting this specific product */}
                <div className="flex items-center gap-3">

                  {/* Dynamic edit link using the product ID */}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Rediger
                  </Link>

                  {/* Sends a DELETE request for this specific product */}
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}