"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type CreateSubCategoryFormProps = {
  category: string;
};

export default function CreateSubCategoryForm({
  category,
}: CreateSubCategoryFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [error, setError] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);


  // =========================
  // CREATE SUBCATEGORY
  // =========================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Skriv inn navn på underkategorien."
      );

      return;
    }

    setCreating(true);

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
            "Kunne ikke opprette underkategori."
        );

        return;
      }

      /*
       * Clear the form after successful creation.
       */
      setName("");
      setShowForm(false);

      /*
       * Refresh server component so the newly
       * created subcategory appears immediately.
       */
      router.refresh();
    } catch {
      setError(
        "Kunne ikke opprette underkategori."
      );
    } finally {
      setCreating(false);
    }
  }


  return (
    <div className="border-t border-gray-200 bg-gray-50">

      {!showForm ? (
        /*
         * Closed state
         */
        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="
            flex
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-2
            px-5
            py-4
            text-sm
            font-semibold
            text-gray-600
            transition

            hover:bg-gray-100
            hover:text-gray-900
          "
        >
          <span className="text-lg leading-none">
            +
          </span>

          Legg til underkategori
        </button>
      ) : (
        /*
         * Open form
         */
        <form
          onSubmit={handleSubmit}
          className="p-4"
        >

          <div className="mb-3 flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Ny underkategori
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Legges til i {category}
              </p>
            </div>


            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setName("");
                setError("");
              }}
              disabled={creating}
              className="
                cursor-pointer
                text-xs
                font-medium
                text-gray-500
                transition
                hover:text-gray-900
              "
            >
              Avbryt
            </button>

          </div>


          <div className="flex flex-col gap-2 sm:flex-row">

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="F.eks. Lamper"
              disabled={creating}
              autoFocus
              className="
                h-11
                min-w-0
                flex-1
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                text-sm
                text-gray-900
                caret-gray-900
                outline-none
                transition
                placeholder:text-gray-400

                hover:border-gray-400

                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20

                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />


            <button
              type="submit"
              disabled={
                creating ||
                !name.trim()
              }
              className="
                h-11
                shrink-0
                cursor-pointer
                rounded-xl
                bg-gray-900
                px-5
                text-sm
                font-semibold
                text-white
                transition

                hover:bg-gray-700

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {creating
                ? "Oppretter..."
                : "Opprett"}
            </button>

          </div>


          {error && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

        </form>
      )}

    </div>
  );
}