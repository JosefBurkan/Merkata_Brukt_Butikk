"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};

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
  const [current, setCurrent] = useState(
    newProducts.length >= 2 ? 1 : 0
  );

  const [visibleCount, setVisibleCount] = useState(1);

  const carouselAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(newProducts.length >= 2 ? 1 : 0);
  }, [newProducts.length]);

  // Measure only the area available for cards
  useEffect(() => {
    const carouselArea = carouselAreaRef.current;

    if (!carouselArea) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // 3 x 300px cards + 2 x 32px gaps
      if (width >= 964) {
        setVisibleCount(3);
      }

      // 2 x 300px cards + 32px gap
      else if (width >= 632) {
        setVisibleCount(2);
      }

      // Mobile / narrow screen
      else {
        setVisibleCount(1);
      }
    });

    observer.observe(carouselArea);

    return () => observer.disconnect();
  }, []);

  const productItems: CarouselItem[] = newProducts.map((product) => ({
    type: "product",
    product,
  }));

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

  const carouselItems: CarouselItem[] = [
    ...productItems,
    ...placeholderItems,
  ];

  const next = () => {
    setCurrent(
      (currentIndex) =>
        (currentIndex + 1) % carouselItems.length
    );
  };

  const previous = () => {
    setCurrent(
      (currentIndex) =>
        (currentIndex - 1 + carouselItems.length) %
        carouselItems.length
    );
  };

  let visibleItems: CarouselItem[];

  if (visibleCount === 3) {
    visibleItems = [
      carouselItems[
        (current - 1 + carouselItems.length) %
          carouselItems.length
      ],

      carouselItems[current],

      carouselItems[
        (current + 1) % carouselItems.length
      ],
    ];
  } else if (visibleCount === 2) {
    visibleItems = [
      carouselItems[current],

      carouselItems[
        (current + 1) % carouselItems.length
      ],
    ];
  } else {
    visibleItems = [carouselItems[current]];
  }

  return (
  <div className="relative mx-auto grid w-full max-w-7xl grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 px-2 sm:grid-cols-[48px_minmax(0,1fr)_48px] sm:gap-4 sm:px-4">

    {/* Previous */}
    <button
  type="button"
  onPointerUp={previous}
  className="relative z-[100] flex h-12 w-12 shrink-0 cursor-pointer select-none items-center justify-center touch-none"
  aria-label="Forrige produkt"
>
  <svg
    viewBox="0 0 24 24"
    className="pointer-events-none h-8 w-8 rotate-180"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
</button>

    {/* Card area */}
    <div
  ref={carouselAreaRef}
  className="relative z-0 flex min-w-0 flex-1 items-center justify-center gap-8 overflow-hidden pointer-events-none"
>
      {visibleItems.map((item, index) => {
        // On mobile the single card may shrink to fit.
        // With 2-3 cards each card stays 300px wide.
        const cardWidth =
          visibleCount === 1
            ? "w-full max-w-[300px]"
            : "w-[300px]";

        // Coming soon card
        if (item.type === "placeholder") {
          return (
            <div
              key={`${item.id}-${index}`}
              className={`flex h-96 ${cardWidth} min-w-0 shrink-0 flex-col overflow-hidden rounded-xl bg-[var(--card)] shadow-sm`}
            >
              <div className="flex h-64 shrink-0 items-center justify-center bg-gray-100 text-gray-500">
                Kommer snart
              </div>

              <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nye produkter
                </h3>

                <p className="mt-2 text-sm text-gray-900">
                  Flere produkter legges ut snart.
                </p>
              </div>
            </div>
          );
        }

        const product = item.product;

        // Real product card
        return (
          <div
            key={`${product.id}-${index}`}
            className={`flex h-96 ${cardWidth} min-w-0 shrink-0 flex-col overflow-hidden rounded-xl bg-[var(--card)] shadow-sm`}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-64 w-full shrink-0 object-cover"
              />
            ) : (
              <div className="flex h-64 shrink-0 items-center justify-center bg-gray-100 text-gray-400">
                Ingen bilde
              </div>
            )}

            <div className="flex flex-1 flex-col items-center justify-center p-5 text-center text-gray-900">
              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="mt-1 text-sm">
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

    {/* Next */}
    <button
  type="button"
  onPointerUp={next}
  className="relative z-[100] flex h-12 w-12 shrink-0 cursor-pointer select-none items-center justify-center touch-none"
  aria-label="Neste produkt"
>
  <svg
    viewBox="0 0 24 24"
    className="pointer-events-none h-8 w-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
</button>
  </div>
);
}