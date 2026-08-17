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

  const { data: products, error: productsError } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error(productsError);
  }

  return (
    <main className="min-h-screen bg-[var(--main)] text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Adminpanel</h1>

            <p className="mt-1 text-gray-600">
              Administrer produkter i butikken
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mb-8">
          <Link
            href="/admin/products/new"
            className="inline-block rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            + Legg til produkt
          </Link>
        </div>

        <section>
          <h2 className="mb-5 text-xl font-semibold">Produkter</h2>

          <div className="grid gap-4">
            {products?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>{product.price} kr</span>
                    <span>{product.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Rediger
                  </Link>

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