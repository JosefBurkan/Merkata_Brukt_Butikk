"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { categoryMap } from "@/lib/categories";

type FilterProps = {
  name: string;
};

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

export default function Filter({
  name,
}: FilterProps) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  /*
   * name comes from the URL.
   *
   * Example:
   * "elektronikk"
   *
   * But the database stores:
   * "Elektronikk"
   *
   * categoryMap converts between them.
   */
  const category =
    categoryMap[name];

  const [
    subCategories,
    setSubCategories,
  ] = useState<SubCategory[]>([]);

  const [
    loadingSubCategories,
    setLoadingSubCategories,
  ] = useState(false);


  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  useEffect(() => {
    async function fetchSubCategories() {

      if (!category) {
        setSubCategories([]);

        return;
      }

      setLoadingSubCategories(
        true
      );

      try {
        const response =
          await fetch(
            `/api/subcategories?category=${encodeURIComponent(
              category
            )}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "Could not fetch subcategories:",
            data
          );

          setSubCategories([]);

          return;
        }

        setSubCategories(data);
      } catch (error) {
        console.error(
          "Could not fetch subcategories:",
          error
        );

        setSubCategories([]);
      } finally {
        setLoadingSubCategories(
          false
        );
      }
    }

    fetchSubCategories();
  }, [category]);


  // =========================
  // UPDATE FILTER
  // =========================

  function updateFilter(
    key: string,
    value: string
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value) {
      params.set(
        key,
        value
      );
    } else {
      params.delete(key);
    }

    const queryString =
      params.toString();

    router.replace(
      queryString
        ? `/products/${name}?${queryString}`
        : `/products/${name}`,
      {
        scroll: false,
      }
    );
  }


  // =========================
  // CURRENT VALUES
  // =========================

  const currentMaxPrice =
    searchParams.get(
      "maxPrice"
    ) ?? "";

  const currentSubCategory =
    searchParams.get(
      "sub_category"
    ) ?? "";


  return (
    <div className="flex flex-col gap-5">

      {/* =========================
          PRICE
      ========================= */}

      <div>

        <label
          htmlFor="price"
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          Pris
        </label>

        <select
          id="price"
          value={
            currentMaxPrice
          }
          onChange={(
            event: ChangeEvent<HTMLSelectElement>
          ) =>
            updateFilter(
              "maxPrice",
              event.target.value
            )
          }
          className="
            h-11
            w-full
            cursor-pointer
            rounded-lg
            border
            border-black/10
            bg-white
            px-3
            text-sm
            text-gray-900
            outline-none
            transition

            hover:border-black/20

            focus:border-brand
            focus:ring-2
            focus:ring-brand/20
          "
        >

          <option value="">
            Alle priser
          </option>

          <option value="100">
            Under 100 kr
          </option>

          <option value="250">
            Under 250 kr
          </option>

          <option value="500">
            Under 500 kr
          </option>

          <option value="1000">
            Under 1000 kr
          </option>

        </select>

      </div>


      {/* =========================
          SUBCATEGORY
      ========================= */}

      <div>

        <label
          htmlFor="sub-category"
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          Underkategori
        </label>

        <select
          id="sub-category"
          value={
            currentSubCategory
          }
          disabled={
            loadingSubCategories
          }
          onChange={(
            event: ChangeEvent<HTMLSelectElement>
          ) =>
            updateFilter(
              "sub_category",
              event.target.value
            )
          }
          className="
            h-11
            w-full
            cursor-pointer
            rounded-lg
            border
            border-black/10
            bg-white
            px-3
            text-sm
            text-gray-900
            outline-none
            transition

            hover:border-black/20

            focus:border-brand
            focus:ring-2
            focus:ring-brand/20

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400
          "
        >

          {loadingSubCategories ? (
            <option value="">
              Henter underkategorier...
            </option>
          ) : (
            <>

              <option value="">
                Alle underkategorier
              </option>

              {subCategories.map(
                (subCategory) => (
                  <option
                    key={
                      subCategory.id
                    }
                    value={
                      subCategory.name
                    }
                  >
                    {
                      subCategory.name
                    }
                  </option>
                )
              )}

            </>
          )}

        </select>

      </div>

    </div>
  );
}