"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";
import { categories } from "@/lib/categories";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Category fields
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // Available subcategories for selected category
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Used while fetching subcategories
  const [loadingSubCategories, setLoadingSubCategories] =
    useState(false);

  // Controls the "create new subcategory" input
  const [showNewSubCategory, setShowNewSubCategory] =
    useState(false);

  const [newSubCategoryName, setNewSubCategoryName] =
    useState("");

  const [creatingSubCategory, setCreatingSubCategory] =
    useState(false);

  // Current Cloudinary image
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [imagePublicId, setImagePublicId] =
    useState<string | null>(null);


  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  async function fetchSubCategories(
    selectedCategory: string
  ) {
    if (!selectedCategory) {
      setSubCategories([]);
      return [];
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

        setSubCategories([]);

        return [];
      }

      setSubCategories(data);

      return data;
    } catch {
      setError(
        "Kunne ikke hente underkategorier"
      );

      setSubCategories([]);

      return [];
    } finally {
      setLoadingSubCategories(false);
    }
  }


  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error ??
            "Kunne ikke hente produktet"
          );

          return;
        }

        // Load normal product information
        setName(data.name ?? "");
        setAge(data.age?.toString() ?? "");
        setPrice(data.price?.toString() ?? "");
        setDescription(data.description ?? "");

        // Load category
        setCategory(data.category);

        // Fetch the subcategories belonging
        // to the product's category
        await fetchSubCategories(
          data.category
        );

        // Select the product's existing subcategory
        setSubCategory(
          data.sub_category
        );

        // Load current image information
        setImageUrl(
          data.image_url ?? null
        );

        setImagePublicId(
          data.image_public_id ?? null
        );
      } catch {
        setError(
          "Kunne ikke hente produktet"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);


  // =========================
  // CATEGORY CHANGE
  // =========================

  async function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const selectedCategory =
      event.target.value;

    setCategory(selectedCategory);

    // Old subcategory should not stay selected
    // when changing main category
    setSubCategory("");

    setShowNewSubCategory(false);
    setNewSubCategoryName("");
    setError("");

    await fetchSubCategories(
      selectedCategory
    );
  }


  // =========================
  // SUBCATEGORY CHANGE
  // =========================

  function handleSubCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;

    // Special option for creating
    // a brand-new subcategory
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
  // CREATE SUBCATEGORY
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
            "Content-Type":
              "application/json",
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

      // Add new subcategory to dropdown
      setSubCategories((previous) =>
        [...previous, data].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
              "nb"
            )
        )
      );

      // Automatically select it
      setSubCategory(data.name);

      // Close creation field
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
  // SAVE PRODUCT
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

    // Start with existing image
    let newImageUrl = imageUrl;

    let newImagePublicId =
      imagePublicId;


    // =========================
    // REPLACE IMAGE
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

      newImageUrl =
        uploadData.image_url;

      newImagePublicId =
        uploadData.image_public_id;
    }


    // =========================
    // UPDATED PRODUCT
    // =========================

    const product = {
      name,

      age: age
        ? Number(age)
        : null,

      price: Number(price),

      description,

      category,

      // Subcategory is now required
      sub_category: subCategory,

      image_url: newImageUrl,

      image_public_id:
        newImagePublicId,
    };


    // =========================
    // UPDATE PRODUCT
    // =========================

    const response = await fetch(
      `/api/products/${id}`,
      {
        method: "PATCH",

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
        "Kunne ikke oppdatere produktet"
      );

      return;
    }

    router.push("/admin");
    router.refresh();
  }


  // =========================
  // LOADING PAGE
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--main)] px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-2xl">
          <p>Laster produkt...</p>
        </div>
      </main>
    );
  }


  // =========================
  // EDIT FORM
  // =========================

  return (
    <main className="min-h-screen bg-[var(--main)] text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Rediger produkt
          </h1>

          <p className="mt-1 text-gray-600">
            Endre informasjonen om produktet
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
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              type="number"
              min="0"
              value={age}
              onChange={(event) =>
                setAge(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              value={category}
              onChange={handleCategoryChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                Velg kategori
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>


          {/* Dynamic subcategory */}
          <div>
            <label
              htmlFor="sub_category"
              className="mb-2 block text-sm font-medium"
            >
              Underkategori
            </label>

            <select
              id="sub_category"
              value={subCategory}
              onChange={
                handleSubCategoryChange
              }
              required
              disabled={
                !category ||
                loadingSubCategories
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >

              {loadingSubCategories ? (
                <option value="">
                  Henter underkategorier...
                </option>
              ) : (
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


          {/* Create a new subcategory */}
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
                  placeholder="For eksempel Spill"
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


          {/* Current image / replacement image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium"
            >
              Produktbilde
            </label>

            {imageUrl && (
              <img
                src={imageUrl}
                alt={name}
                className="mb-4 h-40 w-40 rounded-lg object-cover"
              />
            )}

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Velg et nytt bilde bare hvis du vil erstatte det eksisterende bildet.
            </p>
          </div>


          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}


          {/* Save */}
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Lagre endringer
          </button>

        </form>
      </div>
    </main>
  );
}