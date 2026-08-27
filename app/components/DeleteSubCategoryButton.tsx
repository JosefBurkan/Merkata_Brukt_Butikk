"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteSubCategoryButtonProps = {
  id: number;
  name: string;
  category: string;
};

export default function DeleteSubCategoryButton({
  id,
  name,
  category,
}: DeleteSubCategoryButtonProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError("");

    const confirmed = window.confirm(
      `Er du sikker på at du vil slette "${name}" under "${category}"?\n\n` +
      `Alle produktene i "${name}" ` +
      `blir automatisk flyttet til "Annet" under "${category}".\n\n` +
      `Produktene blir ikke slettet.\n\n` +
      `Denne handlingen kan ikke angres.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/subcategories/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Kunne ikke slette underkategorien"
        );

        return;
      }

      // Refresh the Server Component so the deleted
      // subcategory disappears from the list.
      router.refresh();
    } catch {
      setError(
        "Kunne ikke slette underkategorien"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Sletter..." : "Slett"}
      </button>

      {error && (
        <p className="max-w-64 text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}