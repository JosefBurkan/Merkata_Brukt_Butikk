"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { categories } from "@/lib/categories";
import BackToAdmin from "@/app/components/BackToAdmin";

type SubCategory = {
  id: number;
  name: string;
  category: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function NewProductPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  const [category, setCategory] =
    useState("");

  const [subCategory, setSubCategory] =
    useState("");

  const [
    subCategories,
    setSubCategories,
  ] = useState<SubCategory[]>([]);

  const [
    loadingSubCategories,
    setLoadingSubCategories,
  ] = useState(false);

  const [
    showNewSubCategory,
    setShowNewSubCategory,
  ] = useState(false);

  const [
    newSubCategoryName,
    setNewSubCategoryName,
  ] = useState("");

  const [
    creatingSubCategory,
    setCreatingSubCategory,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [
    imagePreview,
    setImagePreview,
  ] = useState<string | null>(null);


  // =========================
  // CATEGORY CHANGE
  // =========================

  async function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const selectedCategory =
      event.target.value;

    setCategory(selectedCategory);

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

      const data =
        await response.json();

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
    const value =
      event.target.value;

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
      setError(
        "Velg kategori først"
      );

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

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Kunne ikke opprette underkategori"
        );

        return;
      }

      setSubCategories(
        (previous) =>
          [...previous, data].sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
                "nb"
              )
          )
      );

      setSubCategory(data.name);

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
  // IMAGE CHANGE
  // =========================

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      setImagePreview(null);

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        "Bildet kan ikke være større enn 5 MB."
      );

      event.target.value = "";

      setImagePreview(null);

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }


  // =========================
  // CREATE PRODUCT
  // =========================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!category) {
      setError(
        "Du må velge en kategori."
      );

      return;
    }

    if (!subCategory) {
      setError(
        "Du må velge en underkategori."
      );

      return;
    }

    setSubmitting(true);

    try {
      const formData =
        new FormData(
          event.currentTarget
        );

      const imageFile =
        formData.get("image");

      let imageUrl:
        | string
        | null = null;

      let imagePublicId:
        | string
        | null = null;


      // =========================
      // UPLOAD IMAGE
      // =========================

      if (
        imageFile instanceof File &&
        imageFile.size > 0
      ) {
        if (
          imageFile.size >
          MAX_IMAGE_SIZE
        ) {
          setError(
            "Bildet kan ikke være større enn 5 MB."
          );

          return;
        }

        const uploadFormData =
          new FormData();

        uploadFormData.append(
          "image",
          imageFile
        );

        const uploadResponse =
          await fetch(
            "/api/upload",
            {
              method: "POST",
              body: uploadFormData,
            }
          );

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
        name: formData.get(
          "name"
        ),

        age: formData.get("age")
          ? Number(
              formData.get("age")
            )
          : null,

        price: Number(
          formData.get("price")
        ),

        description:
          formData.get(
            "description"
          ),

        category,

        sub_category:
          subCategory,

        image_url: imageUrl,

        image_public_id:
          imagePublicId,
      };


      // =========================
      // SAVE PRODUCT
      // =========================

      const response =
        await fetch(
          "/api/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              product
            ),
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
    } catch {
      setError(
        "Noe gikk galt. Prøv igjen."
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="min-h-screen flex-1 bg-gray-100 text-gray-900">

      <div className="mx-auto w-full max-w-5xl px-6 py-10">

        {/* =========================
            BACK
        ========================= */}

        <div className="mb-7">
          <BackToAdmin />
        </div>


        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
            Produktadministrasjon
          </p>

          <h1 className="text-3xl font-bold">
            Legg til produkt
          </h1>

          <p className="mt-2 text-gray-500">
            Opprett et nytt produkt som
            skal vises i butikken.
          </p>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <section className="border-b border-gray-200 p-6 md:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Produktinformasjon
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Grunnleggende informasjon
                om produktet.
              </p>
            </div>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Name */}
              <div className="md:col-span-2">

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Navn
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="F.eks. Vintage bordlampe"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
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

              </div>


              {/* Age */}
              <div>

                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Alder
                </label>

                <div className="relative">

                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    placeholder="0"
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
                      outline-none
                      transition
                      placeholder:text-gray-400

                      hover:border-gray-400

                      focus:border-orange-500
                      focus:ring-2
                      focus:ring-orange-500/20
                    "
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    år
                  </span>

                </div>

              </div>


              {/* Price */}
              <div>

                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pris
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0"
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
                      outline-none
                      transition
                      placeholder:text-gray-400

                      hover:border-gray-400

                      focus:border-orange-500
                      focus:ring-2
                      focus:ring-orange-500/20
                    "
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    kr
                  </span>

                </div>

              </div>


              {/* Description */}
              <div className="md:col-span-2">

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Beskrivelse
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Beskriv produktet, tilstand, egenskaper osv."
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
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

              </div>

            </div>

          </section>


          {/* =========================
              CATEGORY
          ========================= */}

          <section className="border-b border-gray-200 p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-lg font-semibold">
                Kategorisering
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Velg hvor produktet skal
                vises i butikken.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Main category */}
              <div>

                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Kategori
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={
                    handleCategoryChange
                  }
                  required
                  className="
                    h-12
                    w-full
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
                  "
                >
                  <option value="">
                    Velg kategori
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

              </div>


              {/* Subcategory */}
              <div>

                <label
                  htmlFor="sub_category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Underkategori
                  <span className="ml-1 text-red-500">
                    *
                  </span>
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
                  className="
                    h-12
                    w-full
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
                        Henter
                        underkategorier...
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

                        <option value="__new__">
                          + Opprett ny
                          underkategori
                        </option>

                      </>
                    )}

                </select>

              </div>

            </div>


            {/* =========================
                NEW SUBCATEGORY
            ========================= */}

            {showNewSubCategory && (
              <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">

                <div className="mb-3">

                  <h3 className="font-semibold">
                    Opprett ny
                    underkategori
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Underkategorien blir
                    lagt til i{" "}
                    <span className="font-medium text-gray-700">
                      {category}
                    </span>
                    .
                  </p>

                </div>


                <div className="flex flex-col gap-3 sm:flex-row">

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
                    placeholder="Navn på underkategori"
                    className="
                      h-12
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-gray-900
                      outline-none
                      transition

                      focus:border-orange-500
                      focus:ring-2
                      focus:ring-orange-500/20
                    "
                  />


                  <button
                    type="button"
                    onClick={
                      createSubCategory
                    }
                    disabled={
                      creatingSubCategory
                    }
                    className="
                      h-12
                      cursor-pointer
                      rounded-xl
                      bg-gray-900
                      px-6
                      font-medium
                      text-white
                      transition

                      hover:bg-gray-700

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {creatingSubCategory
                      ? "Oppretter..."
                      : "Opprett"}
                  </button>

                </div>

              </div>
            )}

          </section>


          {/* =========================
              IMAGE
          ========================= */}

          <section className="border-b border-gray-200 p-6 md:p-8">

            <div className="mb-6">

              <h2 className="text-lg font-semibold">
                Produktbilde
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Legg til et bilde av
                produktet. Maks 5 MB.
              </p>

            </div>


            <div
              className={`grid grid-cols-1 gap-6 ${
                imagePreview
                  ? "md:grid-cols-[1fr_220px]"
                  : ""
              }`}
            >

              {/* File input */}
              <div>

                <label
                  htmlFor="image"
                  className="
                    flex
                    min-h-[140px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    px-6
                    py-8
                    text-center
                    transition

                    hover:border-orange-400
                    hover:bg-orange-50
                  "
                >

                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line
                        x1="12"
                        x2="12"
                        y1="3"
                        y2="15"
                      />
                    </svg>
                  </div>

                  <p className="font-medium text-gray-700">
                    Velg produktbilde
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG, WEBP eller
                    lignende
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maks 5 MB
                  </p>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="sr-only"
                  />

                </label>

              </div>


              {/* Preview */}
              {imagePreview && (
                <div>

                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Forhåndsvisning
                  </p>

                  <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">

                    <img
                      src={imagePreview}
                      alt="Forhåndsvisning av produkt"
                      className="h-full w-full object-cover"
                    />

                  </div>

                </div>
              )}

            </div>

          </section>


          {/* =========================
              ERROR + ACTIONS
          ========================= */}

          <section className="p-6 md:p-8">

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}


            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/admin"
                  )
                }
                disabled={submitting}
                className="
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-6
                  py-3
                  font-semibold
                  text-gray-700
                  transition

                  hover:bg-gray-50

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Avbryt
              </button>


              <button
                type="submit"
                disabled={submitting}
                className="
                  min-w-[180px]
                  rounded-xl
                  bg-primary
                  px-6
                  py-3
                  font-semibold
                  text-white
                  shadow-sm
                  transition

                  hover:bg-primary-dark
                  hover:shadow-md

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {submitting
                  ? "Oppretter produkt..."
                  : "Legg til produkt"}
              </button>

            </div>

          </section>

        </form>

      </div>

    </main>
  );
}