"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const product = {
      name: formData.get("name"),
      age: formData.get("age")
        ? Number(formData.get("age"))
        : null,
      price: Number(formData.get("price")),
      description: formData.get("description"),
      category: formData.get("category"),
      sub_category: formData.get("sub_category") || null,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Kunne ikke opprette produkt");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
  <main className="min-h-screen bg-gray-100 text-gray-900">
    <div className="mx-auto max-w-2xl px-6 py-10">

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
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Velg kategori</option>
            <option value="Elektronikk">Elektronikk</option>
            <option value="Møbler">Møbler</option>
            <option value="Fritid">Fritid</option>
            <option value="Klær">Klær</option>
            <option value="Musikk">Musikk</option>
            <option value="Annet">Annet</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sub_category"
            className="mb-2 block text-sm font-medium"
          >
            Underkategori
          </label>

          <input
            id="sub_category"
            name="sub_category"
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

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