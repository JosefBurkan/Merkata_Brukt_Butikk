"use client";

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

export default function Carousel({ newProducts }: CarouselProps) {
    const [current, setCurrent] = useState(0);

    // Hvis det ikke finnes noen produkter,
    // viser vi bare en melding i stedet for å krasje siden.
    if (newProducts.length === 0) {
        return (
            <div className="py-10 text-center">
                <p>Ingen produkter tilgjengelig akkurat nå.</p>
            </div>
        );
    }

    // Gå ett produkt fremover.
    // Functional update gjør at vi alltid bruker nyeste state-verdi.
    const next = () => {
        setCurrent((previousCurrent) =>
            (previousCurrent + 1) % newProducts.length
        );
    };

    // Gå ett produkt bakover.
    const previous = () => {
        setCurrent((previousCurrent) =>
            (previousCurrent - 1 + newProducts.length) %
            newProducts.length
        );
    };

    // Finn produktene som skal vises.
    const previousProduct =
        newProducts[
            (current - 1 + newProducts.length) %
            newProducts.length
        ];

    const currentProduct = newProducts[current];

    const nextProduct =
        newProducts[
            (current + 1) % newProducts.length
        ];

    // Lager et produktkort.
    // Da slipper vi å skrive den samme JSX-en tre ganger.
    const renderProduct = (product: Product) => {
        return (
            <div className="product-card">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-[190px] w-full rounded-t-lg object-cover"
                    />
                ) : (
                    <div className="flex h-[190px] w-full items-center justify-center rounded-t-lg bg-black/10">
                        Ingen bilde
                    </div>
                )}

                <p className="text-3xl font-bold">
                    {product.name}
                </p>

                <p className="text-lg font-bold">
                    {product.category}
                </p>

                <p className="text-lg font-bold">
                    {product.price},-
                </p>
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={previous}
                aria-label="Forrige produkt"
            >
                ←
            </button>

            <div className="product-list mx-auto grid-cols-1 justify-items-center gap-50 lg:grid-cols-3">
                {renderProduct(previousProduct)}

                {renderProduct(currentProduct)}

                {renderProduct(nextProduct)}
            </div>

            <button
                type="button"
                onClick={next}
                aria-label="Neste produkt"
            >
                →
            </button>
        </div>
    );
}