"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

type AdminProductFiltersProps = {
  initialSearch: string;
  initialCategory: string;
  initialSubCategory: string;
};

const categories = [
  "Elektronikk",
  "Møbler",
  "Fritid",
  "Klær",
  "Musikk",
  "Annet",
];

export default function AdminProductFilters({
  initialSearch,
  initialCategory,
  initialSubCategory,
}: AdminProductFiltersProps) {
  const router = useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();


  // =========================
  // STATE
  // =========================

  const [search, setSearch] =
    useState(initialSearch);

  const [
    category,
    setCategory,
  ] = useState(
    initialCategory
  );

  const [
    subCategory,
    setSubCategory,
  ] = useState(
    initialSubCategory
  );

  const [
    subCategories,
    setSubCategories,
  ] = useState<
    SubCategory[]
  >([]);

  const [
    loadingSubCategories,
    setLoadingSubCategories,
  ] = useState(false);


  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  useEffect(() => {
    async function loadSubCategories() {
      /*
       * No category selected means
       * subcategory filtering is disabled.
       */
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
          setSubCategories([]);

          return;
        }

        setSubCategories(
          data
        );
      } catch {
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(
          false
        );
      }
    }

    loadSubCategories();
  }, [category]);


  // =========================
  // LIVE SEARCH
  // =========================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        const currentSearch =
          searchParams.get(
            "search"
          ) ?? "";

        const newSearch =
          search.trim();

        /*
         * Don't change the URL if
         * nothing changed.
         */
        if (
          currentSearch ===
          newSearch
        ) {
          return;
        }

        const params =
          new URLSearchParams(
            searchParams.toString()
          );


        if (newSearch) {
          params.set(
            "search",
            newSearch
          );
        } else {
          params.delete(
            "search"
          );
        }


        /*
         * Search changed, so return
         * to the first page.
         */
        params.delete(
          "page"
        );


        const queryString =
          params.toString();


        router.replace(
          queryString
            ? `${pathname}?${queryString}`
            : pathname,
          {
            scroll: false,
          }
        );
      }, 300);


    return () => {
      clearTimeout(timer);
    };
  }, [
    search,
    pathname,
    router,
    searchParams,
  ]);


  // =========================
  // CATEGORY CHANGE
  // =========================

  function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value =
      event.target.value;

    setCategory(value);

    /*
     * Old subcategory belongs to
     * the previous main category,
     * so reset it.
     */
    setSubCategory("");

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    if (value) {
      params.set(
        "category",
        value
      );
    } else {
      params.delete(
        "category"
      );
    }


    /*
     * Always remove old subcategory.
     */
    params.delete(
      "sub_category"
    );


    /*
     * Filters changed, so return
     * to page 1.
     */
    params.delete(
      "page"
    );


    const queryString =
      params.toString();


    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    );
  }


  // =========================
  // SUBCATEGORY CHANGE
  // =========================

  function handleSubCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value =
      event.target.value;

    setSubCategory(value);

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    if (value) {
      params.set(
        "sub_category",
        value
      );
    } else {
      params.delete(
        "sub_category"
      );
    }


    /*
     * Filter changed, return
     * to first page.
     */
    params.delete(
      "page"
    );


    const queryString =
      params.toString();


    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    );
  }


  // =========================
  // RESET FILTERS
  // =========================

  function resetFilters() {
    setSearch("");
    setCategory("");
    setSubCategory("");
    setSubCategories([]);

    router.replace(
      pathname,
      {
        scroll: false,
      }
    );
  }


  // =========================
  // ACTIVE FILTERS
  // =========================

  const hasFilters =
    Boolean(search) ||
    Boolean(category) ||
    Boolean(subCategory);


  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex flex-col gap-3 lg:flex-row">

        {/* =========================
            SEARCH
        ========================= */}

        <div className="relative flex-1">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Søk etter produkt..."
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              pr-12
              text-gray-900
              caret-gray-900
              outline-none
              transition
              placeholder:text-gray-400

              hover:border-gray-400

              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-500/20
            "
          />


          {/* Search icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <path d="m21 21-4.3-4.3" />
            </svg>

          </div>

        </div>


        {/* =========================
            CATEGORY
        ========================= */}

        <select
          value={category}
          onChange={
            handleCategoryChange
          }
          className="
            h-12
            cursor-pointer
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            text-gray-900
            outline-none
            transition

            hover:border-gray-400

            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-500/20

            lg:w-[210px]
          "
        >
          <option value="">
            Alle kategorier
          </option>

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}

        </select>


        {/* =========================
            SUBCATEGORY
        ========================= */}

        <select
          value={subCategory}
          onChange={
            handleSubCategoryChange
          }
          disabled={
            !category ||
            loadingSubCategories
          }
          className="
            h-12
            cursor-pointer
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            text-gray-900
            outline-none
            transition

            hover:border-gray-400

            focus:border-orange-500
            focus:ring-2
            focus:ring-orange-500/20

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400

            lg:w-[230px]
          "
        >

          {!category && (
            <option value="">
              Velg kategori først
            </option>
          )}


          {category &&
            loadingSubCategories && (
              <option value="">
                Henter underkategorier...
              </option>
            )}


          {category &&
            !loadingSubCategories && (
              <>
                <option value="">
                  Alle underkategorier
                </option>

                {subCategories.map(
                  (item) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.name
                      }
                    >
                      {
                        item.name
                      }
                    </option>
                  )
                )}
              </>
            )}

        </select>


        {/* =========================
            RESET
        ========================= */}

        {hasFilters && (
          <button
            type="button"
            onClick={
              resetFilters
            }
            className="
              h-12
              cursor-pointer
              rounded-xl
              border
              border-gray-300
              bg-white
              px-5
              text-sm
              font-medium
              text-gray-700
              transition

              hover:bg-gray-50
            "
          >
            Nullstill
          </button>
        )}

      </div>

    </div>
  );
}