"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Kunne ikke hente produktet");
        setLoading(false);
        return;
      }

      setName(data.name ?? "");
      setAge(data.age?.toString() ?? "");
      setPrice(data.price?.toString() ?? "");
      setDescription(data.description ?? "");
      setCategory(data.category ?? "");
      setSubCategory(data.sub_category ?? "");

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const product = {
      name,
      age: age ? Number(age) : null,
      price: Number(price),
      description,
      category,
      sub_category: subCategory || null,
    };

    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Kunne ikke oppdatere produktet");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--main)] px-6 py-10 text-gray-900">
        <div className="mx-auto max-w-2xl">
          <p>Laster produkt...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--main)] text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Rediger produkt</h1>

          <p className="mt-1 text-gray-600">
            Endre informasjonen om produktet
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
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              type="number"
              min="0"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              type="text"
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
            Lagre endringer
          </button>
        </form>
      </div>
    </main>
  );
}