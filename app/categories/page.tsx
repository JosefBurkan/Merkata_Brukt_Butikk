import Link from "next/link";

const categories = [
    {
        name: "Elektronikk",
        slug: "elektronikk",
    },
    {
        name: "Møbler",
        slug: "mobler",
    },
    {
        name: "Fritid",
        slug: "fritid",
    },
    {
        name: "Klær",
        slug: "klaer",
    },
    {
        name: "Musikk",
        slug: "musikk",
    },
    {
        name: "Annet",
        slug: "annet",
    },
];

export default function Categories() {
    return (
        <main className="categories">
            <section className="news-section">

                {/* Overskrift */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold">
                        Kategorier
                    </h1>

                    <p className="mt-3 text-base opacity-80">
                        Utforsk produktene våre etter kategori
                    </p>
                </div>

                {/* Kategorier */}
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/products/${category.slug}`}
                            className="category-card flex flex-col items-center justify-center px-6 text-center"
                        >
                            <h2 className="text-xl font-bold">
                                {category.name}
                            </h2>
                        </Link>
                    ))}

                </div>
            </section>
        </main>
    );
}