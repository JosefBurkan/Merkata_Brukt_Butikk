"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  // Selected main category
  const [category, setCategory] = useState("");

  // Selected subcategory
  const [subCategory, setSubCategory] = useState("");

  // Subcategories belonging to selected category
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Loading state when fetching subcategories
  const [loadingSubCategories, setLoadingSubCategories] =
    useState(false);

  // Controls whether the "new subcategory" input is visible
  const [showNewSubCategory, setShowNewSubCategory] =
    useState(false);

  // Name typed into the new subcategory input
  const [newSubCategoryName, setNewSubCategoryName] =
    useState("");

  // Loading state while creating a new subcategory
  const [creatingSubCategory, setCreatingSubCategory] =
    useState(false);


  // =========================
  // CATEGORY CHANGE
  // =========================

  async function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);

    // Reset subcategory when main category changes
    setSubCategory("");
    setSubCategories([]);

    setShowNewSubCategory(false);
    setNewSubCategoryName("");

    setError("");

    if (!selectedCategory) {
      return;
    }

    setLoadingSubCategories(true);

    try {
      const response = await fetch(
        `/api/subcategories?category=${encodeURIComponent(
          selectedCategory
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Kunne ikke hente underkategorier"
        );

        return;
      }

      setSubCategories(data);
    } catch {
      setError(
        "Kunne ikke hente underkategorier"
      );
    } finally {
      setLoadingSubCategories(false);
    }
  }


  // =========================
  // SUBCATEGORY CHANGE
  // =========================

  function handleSubCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;

    // Special option used to create a new subcategory
    if (value === "__new__") {
      setSubCategory("");
      setShowNewSubCategory(true);

      return;
    }

    setSubCategory(value);
    setShowNewSubCategory(false);
    setNewSubCategoryName("");
  }


  // =========================
  // CREATE NEW SUBCATEGORY
  // =========================

  async function createSubCategory() {
    setError("");

    const trimmedName =
      newSubCategoryName.trim();

    if (!category) {
      setError("Velg kategori først");

      return;
    }

    if (!trimmedName) {
      setError(
        "Skriv inn navn på underkategorien"
      );

      return;
    }

    setCreatingSubCategory(true);

    try {
      const response = await fetch(
        "/api/subcategories",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: trimmedName,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Kunne ikke opprette underkategori"
        );

        return;
      }

      // Add the newly created subcategory
      // to the dropdown immediately
      setSubCategories((previous) =>
        [...previous, data].sort((a, b) =>
          a.name.localeCompare(
            b.name,
            "nb"
          )
        )
      );

      // Automatically select the new subcategory
      setSubCategory(data.name);

      // Hide and reset the creation input
      setShowNewSubCategory(false);
      setNewSubCategoryName("");
    } catch {
      setError(
        "Kunne ikke opprette underkategori"
      );
    } finally {
      setCreatingSubCategory(false);
    }
  }


  // =========================
  // CREATE PRODUCT
  // =========================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const formData =
      new FormData(event.currentTarget);

    const imageFile =
      formData.get("image");

    let imageUrl: string | null = null;

    let imagePublicId: string | null =
      null;


    // =========================
    // UPLOAD IMAGE
    // =========================

    if (
      imageFile instanceof File &&
      imageFile.size > 0
    ) {
      const uploadFormData =
        new FormData();

      uploadFormData.append(
        "image",
        imageFile
      );

      const uploadResponse =
        await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        setError(
          uploadData.error ??
            "Kunne ikke laste opp bildet"
        );

        return;
      }

      imageUrl =
        uploadData.image_url;

      imagePublicId =
        uploadData.image_public_id;
    }


    // =========================
    // PRODUCT DATA
    // =========================

    const product = {
      name: formData.get("name"),

      age: formData.get("age")
        ? Number(formData.get("age"))
        : null,

      price: Number(
        formData.get("price")
      ),

      description:
        formData.get("description"),

      category,

      sub_category: subCategory,

      image_url: imageUrl,

      image_public_id:
        imagePublicId,
    };


    // =========================
    // SAVE PRODUCT
    // =========================

    const response = await fetch(
      "/api/products",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(product),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Kunne ikke opprette produkt"
      );

      return;
    }

    router.push("/admin");
    router.refresh();
  }


  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Legg til produkt
          </h1>

          <p className="mt-1 text-gray-500">
            Opprett et nytt produkt i butikken
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {/* Product name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Navn
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Product age */}
          <div>
            <label
              htmlFor="age"
              className="mb-2 block text-sm font-medium"
            >
              Alder
            </label>

            <input
              id="age"
              name="age"
              type="number"
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Product price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium"
            >
              Pris
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Product description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Beskrivelse
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Main category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Kategori
            </label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={
                handleCategoryChange
              }
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                Velg kategori
              </option>

              <option value="Elektronikk">
                Elektronikk
              </option>

              <option value="Møbler">
                Møbler
              </option>

              <option value="Fritid">
                Fritid
              </option>

              <option value="Klær">
                Klær
              </option>

              <option value="Musikk">
                Musikk
              </option>

              <option value="Annet">
                Annet
              </option>
            </select>
          </div>


          {/* Subcategory */}
          <div>
            <label
              htmlFor="sub_category"
              className="mb-2 block text-sm font-medium"
            >
              Underkategori
            </label>

            <select
              id="sub_category"
              name="sub_category"
              value={subCategory}
              onChange={
                handleSubCategoryChange
              }
              required
              disabled={
                !category ||
                loadingSubCategories
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                      Velg underkategori
                    </option>

                    {subCategories.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      )
                    )}

                    <option value="__new__">
                      + Opprett ny underkategori
                    </option>
                  </>
                )}

            </select>
          </div>


          {/* Create new subcategory */}
          {showNewSubCategory && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

              <label
                htmlFor="new_sub_category"
                className="mb-2 block text-sm font-medium"
              >
                Ny underkategori
              </label>

              <div className="flex gap-2">

                <input
                  id="new_sub_category"
                  type="text"
                  value={
                    newSubCategoryName
                  }
                  onChange={(event) =>
                    setNewSubCategoryName(
                      event.target.value
                    )
                  }
                  placeholder="Skriv her..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={
                    createSubCategory
                  }
                  disabled={
                    creatingSubCategory
                  }
                  className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingSubCategory
                    ? "Oppretter..."
                    : "Opprett"}
                </button>

              </div>
            </div>
          )}


          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium"
            >
              Produktbilde
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Maks 5 MB.
            </p>
          </div>


          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}


          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Legg til produkt
          </button>

        </form>
      </div>
    </main>
  );
}