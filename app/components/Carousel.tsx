"use client";

import { useState } from "react";


export default function Carousel({newProducts})
{

    const [current, setCurrent] = useState(0);

    // For å bevege karusellen fremover
    // '%' brukes så den skal kunne loope rundt
    const next = () => {
        setCurrent((current + 1) % newProducts.length);
    };

    // Samme, men bakover
    const previous = () => {
        setCurrent((current - 1 + newProducts.length) % newProducts.length);
    };

    return (
        <div className="flex items-center justify-center gap-4">
            <button onClick={previous}>
                ←
            </button>

            <div className="product-list grid-cols-1 lg:grid-cols-3 justify-items-center mx-auto gap-50">

                <div className="product-card">
                    {newProducts[(current - 1 + newProducts.length) % newProducts.length].name}
                </div>

                <div className="product-card">
                    {newProducts[current].name}
                </div>

                <div className="product-card">
                    {newProducts[(current + 1) % newProducts.length].name}
                </div>

            </div>

            <button onClick={next}>
                →
            </button>
            
        </div>
    );
}