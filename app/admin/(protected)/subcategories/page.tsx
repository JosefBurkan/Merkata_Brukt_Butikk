import { cookies } from "next/headers";

import { createClient } from "@/supabase/server";

import { categories } from "@/lib/categories";

import DeleteSubCategoryButton from "@/app/components/DeleteSubCategoryButton";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

export default async function SubCategoriesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch all subcategories from Supabase
  const {
    data: subCategories,
    error,
  } = await supabase
    .from("SubCategory")
    .select("id, name, category")
    .order("name", {
      ascending: true,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--main)] px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-600">
            Kunne ikke hente underkategorier:
            {" "}
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--main)] px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Underkategorier
          </h1>

          <p className="mt-2 text-gray-700">
            Administrer underkategoriene som brukes
            på produktene i butikken.
          </p>
        </div>


        {/* Category groups */}
        <div className="space-y-6">
          {categories.map((category) => {

            // Only get subcategories belonging
            // to this main category.
            const categorySubCategories =
              (subCategories as SubCategory[]).filter(
                (subCategory) =>
                  subCategory.category === category
              );

            return (
              <section
                key={category}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >

                {/* Main category */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-bold">
                    {category}
                  </h2>
                </div>


                {/* Subcategories */}
                <div className="divide-y divide-gray-100">
                  {categorySubCategories.map(
                    (subCategory) => (
                      <div
                        key={subCategory.id}
                        className="flex items-center justify-between gap-4 px-6 py-4"
                      >
                        <div>
                          <p className="font-medium">
                            {subCategory.name}
                          </p>

                          {subCategory.name ===
                            "Annet" && (
                            <p className="mt-1 text-xs text-gray-500">
                              Standard underkategori
                            </p>
                          )}
                        </div>


                        {/* "Annet" cannot be deleted */}
                        {subCategory.name ===
                        "Annet" ? (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                            Kan ikke slettes
                          </span>
                        ) : (
                          <DeleteSubCategoryButton
                            id={subCategory.id}
                            name={
                              subCategory.name
                            }
                            category={
                              subCategory.category
                            }
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </main>
  );
}