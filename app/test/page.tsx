"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-white p-10 text-black">
      <h1 className="mb-5 text-2xl font-bold">
        Client JavaScript Test
      </h1>

      <button
        type="button"
        onClick={() => setCount((value) => value + 1)}
        className="rounded bg-red-500 px-8 py-5 text-xl text-white cursor-pointer"
      >
        Press me
      </button>

      <p className="mt-5 text-xl">
        Count: {count}
      </p>
    </main>
  );
}