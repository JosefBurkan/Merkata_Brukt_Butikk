"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filter({name}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const elektronikk = ["verktøy", "spill"];
    const mobler = ["kjøkken", "stue"];
    const fritid = ["sport", "spill"];
    const klaer = ["overkropp", "underkropp"];
    const musikk = ["pop", "jazz"];
    const annet = ["alt mulig rart", "ingenting"];

    let SubCategories;

    if (name == "elektronikk")
    {
        SubCategories = elektronikk;   
    }
    else if (name == "mobler")
    {
        SubCategories = mobler;   
    }
    else if (name == "fritid")
    {
        SubCategories = fritid;    
     }
     else if (name == "klaer")
     {
         SubCategories = klaer;    
     }
     else if (name == "musikk")
     {
         SubCategories = musikk;    
     }
     else if (name == "annet")
     {
         SubCategories = annet;    
     }

    function priceChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("maxPrice", value);
        } else {
            params.delete("maxPrice");
        }

        router.push(`?${params.toString()}`);
    }

    function subCategory(value: string)
    {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("sub_category", value);
        } else {
            params.delete("sub_category");
        }

        router.push(`?${params.toString()}`);
    }

    return (

        <main>
        <div>
            <select
                onChange={(e) => priceChange(e.target.value)}
                defaultValue={searchParams.get("maxPrice") || ""}
            >
                <option value="">Alle priser</option>
                <option value="500">Under 500 kr</option>
                <option value="1000">Under 1000 kr</option>
                <option value="2000">Under 2000 kr</option>
            </select>

        </div>


        <div>
            <select
                onChange={(e) => subCategory(e.target.value)}
                defaultValue={searchParams.get("sub_category") || ""}
            >
                <option value="">Alle categorier</option>
                <option value={SubCategories[0]}>{SubCategories[0]}</option>
                <option value={SubCategories[1]}>{SubCategories[1]}</option>
            </select>
        </div>
        </main>
    );
}