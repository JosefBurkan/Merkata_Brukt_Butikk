"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
}: {
  productId: number;
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  // Runs when the user clicks the delete button
  async function handleDelete() {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette produktet?"
    );

    if (!confirmed) {
      return;
    }

    // Send a DELETE request to the API route for this specific product
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Kunne ikke slette produktet");
      return;
    }

    // Refresh the current page so the deleted product disappears
    // from the server-rendered product list
    router.refresh();
  }

  return (
    <>
      <button
  type="button"
  onClick={handleDelete}
  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
>
  Slett
</button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}