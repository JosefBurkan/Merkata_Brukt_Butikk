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

                {/*Dette er toppkortet*/}
                <div className="product-card">
                <img 
                    src={newProducts[(current - 1 + newProducts.length) % newProducts.length].image_url}
                    alt={newProducts[(current - 1 + newProducts.length) % newProducts.length].name}
                    className="h-[190px] w-full shrink-0 object-cover rounded-t-lg"
                />
                    <p className="text-3xl font-bold">
                        {newProducts[(current - 1 + newProducts.length) % newProducts.length].name}
                    </p>
                    <p className="text-1xl font-bold">
                        {newProducts[(current - 1 + newProducts.length) % newProducts.length].category}
                    </p>

                    <p className="text-1xl font-bold">
                        {newProducts[(current - 1 + newProducts.length) % newProducts.length].price},-
                    </p>
                </div>

                {/*Dette er midtkortet*/}
                <div className="product-card">
                <img 
                    src={newProducts[current].image_url}
                    alt={newProducts[current].name}
                    className="h-[190px] w-full shrink-0 object-cover rounded-t-lg"
                />
                    <p className="text-3xl font-bold">
                        {newProducts[current].name}
                    </p>
                    <p className="text-1xl font-bold">
                        {newProducts[current].category}
                    </p>

                    <p className="text-1xl font-bold">
                        {newProducts[current].price},-
                    </p>
                </div>

                {/*Dette er bunnkortet*/}
                <div className="product-card">
                <img 
                    src={newProducts[(current + 1) % newProducts.length].image_url}
                    alt={newProducts[(current + 1) % newProducts.length].name}
                    className="h-[190px] w-full shrink-0 object-cover rounded-t-lg"
                />
                    <p className="text-3xl font-bold">
                        {newProducts[(current + 1) % newProducts.length].name}
                    </p>
                    <p className="text-1xl font-bold">
                        {newProducts[(current + 1) % newProducts.length].category}
                    </p>

                    <p className="text-1xl font-bold">
                        {newProducts[(current + 1) % newProducts.length].price},-
                    </p>
                </div>

            </div>

            <button onClick={next}>
                →
            </button>
            
        </div>
    );
}