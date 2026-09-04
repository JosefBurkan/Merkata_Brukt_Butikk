"use client";

import ModalButton from "@/app/components/ModalButton";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};

type CarouselProps = {
  newProducts: Product[];
};

export default function Carousel({
  newProducts,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  /*
   * If there are no products,
   * show a message instead of trying
   * to create the carousel.
   */
  if (newProducts.length === 0) {
    return (
      <div className="py-10 text-center">
        <p>Ingen produkter tilgjengelig akkurat nå.</p>
      </div>
    );
  }

  /*
   * Move one product forward.
   */
  const next = () => {
    setCurrent(
      (previousCurrent) =>
        (previousCurrent + 1) % newProducts.length
    );
  };

  /*
   * Move one product backwards.
   */
  const previous = () => {
    setCurrent(
      (previousCurrent) =>
        (previousCurrent - 1 + newProducts.length) %
        newProducts.length
    );
  };

  /*
   * Find previous product.
   */
  const previousProduct =
    newProducts[
      (current - 1 + newProducts.length) %
        newProducts.length
    ];

  /*
   * Current product.
   */
  const currentProduct = newProducts[current];

  /*
   * Find next product.
   */
  const nextProduct =
    newProducts[
      (current + 1) % newProducts.length
    ];

  /*
   * Reusable product card.
   */
  const renderProduct = (product: Product) => {
    return (
        <div className="h-[300px] w-[300px] overflow-hidden rounded-[10px] bg-card transition duration-200 hover:-translate-y-[5px] hover:shadow-xl">
            
        <ModalButton key={product.id} product={product}>

            {/* Product image */}
            {product.image_url ? (
            <img
                src={product.image_url}
                alt={product.name}
                className="h-[190px] w-full object-cover"
            />
            ) : (
            <div className="flex h-[190px] w-full items-center justify-center bg-black/10">
                Ingen bilde
            </div>
            )}

            {/* Product information */}
            <div className="px-3 py-1">
            <p className="truncate text-2xl font-bold">
                {product.name}
            </p>

            <p className="text-lg font-bold">
                {product.category}
            </p>

            <p className="text-lg font-bold">
                {product.price},-
            </p>
            </div>
        </ModalButton>
      </div>
    );
  };

  return (
    <div className="flex w-full items-center justify-center gap-4">

      {/* Previous button */}
      <button
        type="button"
        onClick={previous}
        aria-label="Forrige produkt"
        className="cursor-pointer text-2xl transition duration-200 hover:scale-125"
      >
        ←
      </button>

      {/* Products */}
      <div className="grid w-full max-w-[1000px] grid-cols-1 justify-items-center gap-8 lg:grid-cols-3">

        {renderProduct(previousProduct)}

        {renderProduct(currentProduct)}

        {renderProduct(nextProduct)}

      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        aria-label="Neste produkt"
        className="cursor-pointer text-2xl transition duration-200 hover:scale-125"
      >
        →
      </button>

    </div>
  );
}