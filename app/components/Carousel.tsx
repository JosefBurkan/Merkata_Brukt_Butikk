"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};

// A carousel item can either be a real product
// or a "Coming soon" placeholder
type CarouselItem =
  | {
      type: "product";
      product: Product;
    }
  | {
      type: "placeholder";
      id: string;
    };

export default function Carousel({
  newProducts,
}: {
  newProducts: Product[];
}) {
  const [current, setCurrent] = useState(0);

  // Convert real products into carousel items
  const productItems: CarouselItem[] = newProducts.map((product) => ({
    type: "product",
    product,
  }));

  // Always add three "Coming soon" cards to the carousel
  const placeholderItems: CarouselItem[] = [
    {
      type: "placeholder",
      id: "coming-soon-1",
    },
    {
      type: "placeholder",
      id: "coming-soon-2",
    },
    {
      type: "placeholder",
      id: "coming-soon-3",
    },
  ];

  // Real products and placeholders are part of the same carousel
  const carouselItems = [
    ...productItems,
    ...placeholderItems,
  ];

  // Move one position forward and loop back to the beginning
  const next = () => {
    setCurrent(
      (current + 1) % carouselItems.length
    );
  };

  // Move one position backwards and loop back to the end
  const previous = () => {
    setCurrent(
      (current - 1 + carouselItems.length) %
        carouselItems.length
    );
  };

  // Always display the previous, current and next carousel item
  const visibleItems = [
    carouselItems[
      (current - 1 + carouselItems.length) %
        carouselItems.length
    ],

    carouselItems[current],

    carouselItems[
      (current + 1) % carouselItems.length
    ],
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 px-4">
      {/* Previous button */}
      <button
        type="button"
        onClick={previous}
        className="text-3xl"
      >
        ←
      </button>

      {/* Always display three cards */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => {
          // Placeholder card
          if (item.type === "placeholder") {
            return (
              <div
                key={`${item.id}-${index}`}
                className="product-card overflow-hidden rounded-xl shadow-sm"
              >
                <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-500">
                  Kommer snart
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Nye produkter
                  </h3>

                  <p className="mt-2 text-sm text-gray-900">
                    Flere produkter legges ut snart.
                  </p>
                  <p className="mt-3 font-semibold text-gray-900">
                    Følg med!
                </p>
                </div>
              </div>
            );
          }

          // Real product card
          const product = item.product;

          return (
            <div
              key={`${product.id}-${index}`}
              className="product-card overflow-hidden rounded-xl shadow-sm"
            >
              {/* Product image */}
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
                  Ingen bilde
                </div>
              )}

              {/* Product information */}
              <div className="p-5 text-gray-900">
                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-gray-900">
                  {product.category}
                </p>

                <p className="mt-3 font-semibold">
                  {product.price} kr
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        className="text-3xl"
      >
        →
      </button>
    </div>
  );
}