import { cookies } from "next/headers";

import { createClient } from "@/supabase/server";

import { categories } from "@/lib/categories";

import DeleteSubCategoryButton from "@/app/components/DeleteSubCategoryButton";
import CreateSubCategoryForm from "@/app/components/CreateSubCategoryForm";
import BackToAdmin from "@/app/components/BackToAdmin";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

export default async function SubCategoriesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);


  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  const {
    data: subCategories,
    error,
  } = await supabase
    .from("SubCategory")
    .select(
      "id, name, category"
    )
    .order("name", {
      ascending: true,
    });


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="min-h-screen flex-1 bg-main text-gray-900">

        <div className="mx-auto w-full max-w-6xl px-6 py-10">

          <div className="mb-7">
            <BackToAdmin />
          </div>


          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <h1 className="text-lg font-semibold text-red-800">
              Kunne ikke hente
              underkategorier
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error.message}
            </p>

          </div>

        </div>

      </main>
    );
  }


  // =========================
  // PREPARE DATA
  // =========================

  const allSubCategories =
    (subCategories ??
      []) as SubCategory[];

  const totalSubCategories =
    allSubCategories.length;


  /*
   * Group subcategories by their
   * parent category.
   */
  const groupedSubCategories =
    categories.reduce(
      (
        groups,
        category
      ) => {
        groups[category] =
          allSubCategories.filter(
            (subCategory) =>
              subCategory.category ===
              category
          );

        return groups;
      },
      {} as Record<
        string,
        SubCategory[]
      >
    );


  return (
    <main className="min-h-screen flex-1 bg-main text-gray-900">

      <div className="mx-auto w-full max-w-6xl px-6 py-10">

        {/* =========================
            BACK
        ========================= */}

        <div className="mb-7">
          <BackToAdmin />
        </div>


        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-gray-600">
              Produktadministrasjon
            </p>

            <h1 className="text-3xl font-bold">
              Underkategorier
            </h1>

            <p className="mt-2 max-w-2xl text-gray-600">
              Opprett og administrer
              underkategoriene som brukes
              til å organisere produktene
              i butikken.
            </p>

          </div>


          {/* Total count */}
          <div className="shrink-0 rounded-xl border border-black/10 bg-white/70 px-5 py-3 shadow-sm">

            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Totalt
            </p>

            <p className="mt-1 text-2xl font-bold">
              {totalSubCategories}
            </p>

            <p className="text-xs text-gray-500">
              underkategorier
            </p>

          </div>

        </div>


        {/* =========================
            INFORMATION
        ========================= */}

        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">

          <div className="flex gap-3">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              i
            </div>


            <div>

              <p className="font-medium text-blue-900">
                Om underkategorier
              </p>

              <p className="mt-1 text-sm leading-relaxed text-blue-700">
                Underkategorien{" "}
                <span className="font-semibold">
                  Annet
                </span>{" "}
                er standard for alle
                kategorier og kan ikke
                slettes. Du kan opprette
                nye underkategorier
                direkte under hver
                kategori.
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            CATEGORY GRID
        ========================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {categories.map(
            (category) => {

              const categorySubCategories =
                groupedSubCategories[
                  category
                ] ?? [];

              const customCount =
                categorySubCategories.filter(
                  (subCategory) =>
                    subCategory.name !==
                    "Annet"
                ).length;


              return (
                <section
                  key={category}
                  className="
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                  "
                >

                  {/* =========================
                      CATEGORY HEADER
                  ========================= */}

                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-5">

                    <div>

                      <h2 className="text-lg font-bold">
                        {category}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">

                        {customCount === 0
                          ? "Ingen egendefinerte underkategorier"
                          : `${customCount} ${
                              customCount ===
                              1
                                ? "egendefinert underkategori"
                                : "egendefinerte underkategorier"
                            }`}

                      </p>

                    </div>


                    {/* Count badge */}
                    <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-gray-200 px-3 text-sm font-semibold text-gray-700">

                      {
                        categorySubCategories.length
                      }

                    </div>

                  </div>


                  {/* =========================
                      SUBCATEGORY LIST
                  ========================= */}

                  {/*
                   * flex-1 is important here.
                   *
                   * It makes this part grow so
                   * category cards beside each
                   * other stay the same height.
                   */}
                  <div className="flex-1 divide-y divide-gray-100">

                    {categorySubCategories.length >
                    0 ? (

                      categorySubCategories.map(
                        (
                          subCategory
                        ) => {

                          const isDefault =
                            subCategory.name ===
                            "Annet";


                          return (
                            <div
                              key={
                                subCategory.id
                              }
                              className="
                                flex
                                min-h-[76px]
                                items-center
                                justify-between
                                gap-4
                                px-6
                                py-4
                                transition

                                hover:bg-gray-50
                              "
                            >

                              {/* Information */}
                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <p className="font-medium text-gray-900">
                                    {
                                      subCategory.name
                                    }
                                  </p>


                                  {isDefault && (
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                                      Standard
                                    </span>
                                  )}

                                </div>


                                {isDefault ? (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Brukes når ingen
                                    annen
                                    underkategori
                                    passer.
                                  </p>
                                ) : (
                                  <p className="mt-1 text-xs text-gray-400">
                                    Egendefinert
                                    underkategori
                                  </p>
                                )}

                              </div>


                              {/* Action */}
                              <div className="shrink-0">

                                {isDefault ? (
                                  <span className="inline-flex cursor-not-allowed items-center rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-400">
                                    Kan ikke slettes
                                  </span>
                                ) : (
                                  <DeleteSubCategoryButton
                                    id={
                                      subCategory.id
                                    }
                                    name={
                                      subCategory.name
                                    }
                                    category={
                                      subCategory.category
                                    }
                                  />
                                )}

                              </div>

                            </div>
                          );
                        }
                      )

                    ) : (

                      <div className="flex min-h-[100px] items-center justify-center px-6 py-8 text-center">

                        <div>

                          <p className="text-sm font-medium text-gray-600">
                            Ingen
                            underkategorier
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Opprett en
                            underkategori
                            nedenfor.
                          </p>

                        </div>

                      </div>

                    )}

                  </div>


                  {/* =========================
                      CREATE SUBCATEGORY
                  ========================= */}

                  <CreateSubCategoryForm
                    category={category}
                  />

                </section>
              );
            }
          )}

        </div>

      </div>

    </main>
  );
}