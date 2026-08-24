"use client"

import { useRouter } from 'next/navigation'


export default function Categories() {

    const router = useRouter();

    const dynamicRoute = (name) =>
    {
        router.push(`products/${name}`)
    }    
    
    return (
        <main className="categories">
            <section className="news-section">
                <h2 className="pb-10">Kategorier</h2>
                <div className="product-list grid grid-cols-1 lg:grid-cols-3 gap-50 justify-items-center mx-auto">
                    <button onClick={() => dynamicRoute("elektronikk")} className="product-card">elektronikk</button>
                    <button onClick={() => dynamicRoute("mobler")} className="product-card">møbler</button>
                    <button onClick={() => dynamicRoute("fritid")} className="product-card">fritid</button>
                    <button onClick={() => dynamicRoute("klaer")} className="product-card">klær</button>
                    <button onClick={() => dynamicRoute("musikk")} className="product-card">musikk</button>
                    <button onClick={() => dynamicRoute("annet")} className="product-card">annet</button>
                </div>
            </section>
        </main>
    );
}