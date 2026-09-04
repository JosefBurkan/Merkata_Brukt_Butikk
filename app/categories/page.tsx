import Link from "next/link";

const categories = [
  {
    name: "Elektronikk",
    slug: "elektronikk",
    description:
      "Elektronikk, lyd, bilde og andre tekniske produkter.",
  },
  {
    name: "Møbler",
    slug: "mobler",
    description:
      "Møbler, interiør og unike ting til hjemmet.",
  },
  {
    name: "Fritid",
    slug: "fritid",
    description:
      "Produkter for hobby, aktivitet og fritid.",
  },
  {
    name: "Klær",
    slug: "klaer",
    description:
      "Brukte klær, vintage og tidløse plagg.",
  },
  {
    name: "Musikk",
    slug: "musikk",
    description:
      "Plater, musikkutstyr og andre musikalske funn.",
  },
  {
    name: "Annet",
    slug: "annet",
    description:
      "Unike gjenstander som ikke passer i de andre kategoriene.",
  },
];

export default function Categories() {
  return (
      <main className="min-h-screen flex-1 bg-page text-gray-900">
            
          
          <section className="px-5 py-14 md:px-8 md:py-20 lg:px-12">
              
            
              <div className="mx-auto w-full max-w-7xl">
                  
                {/* Breadcrumbs */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-8 flex flex-wrap items-center gap-2 text-sm"
                    >
                    <Link
                        href="/"
                        className="opacity-70 transition hover:opacity-100"
                    >
                        Forside
                    </Link>

                    <span className="opacity-40">
                        /
                    </span>

                    <p
                        className="font-semibold"
                    >
                        Produkter
                    </p>

                </nav>
                        


          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-14 text-center">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Utforsk butikken
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Kategorier
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Finn det du leter etter ved å utforske produktene våre etter
            kategori.                          
            </p>
                      
                      
                  </div>
                  
        <div className="pb-5 font-semibold text-gray-700 transition hover:text-brand">
            <Link
                href="products/alt">
                Se alle produkter her →  
            </Link>
        </div>
                  

                  
          {/* =========================
              CATEGORY GRID
          ========================= */}
                  
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="
                  group
                  relative
                  flex
                  min-h-[200px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/5
                  bg-category
                  p-7
                  shadow-sm
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:bg-category-hover
                  hover:shadow-xl
                "
              >

                {/* Decorative circle */}
                <div
                  className="
                    absolute
                    -right-8
                    -top-8
                    h-32
                    w-32
                    rounded-full
                    bg-white/[0.04]
                    transition-all
                    duration-300

                    group-hover:-right-5
                    group-hover:-top-5
                    group-hover:scale-110
                    group-hover:bg-brand/30
                  "
                />


                {/* Content */}
                <div className="relative z-10 flex w-full flex-col justify-between">

                  {/* Arrow */}
                  <div className="flex justify-end">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                        text-white
                        transition-all
                        duration-300

                        group-hover:translate-x-1
                        group-hover:bg-white
                        group-hover:text-category
                      "
                    >
                      →
                    </div>

                  </div>


                  {/* Text */}
                  <div>

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {category.name}
                    </h2>

                    <p className="mt-3 max-w-[300px] text-sm leading-6 text-white/70">
                      {category.description}
                    </p>

                  </div>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}