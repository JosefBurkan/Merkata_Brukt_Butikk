import Link from "next/link";

const categories = [
  {
    name: "Elektronikk",
    slug: "elektronikk",
    description: "Elektronikk, lyd, bilde og andre tekniske produkter.",
  },
  {
    name: "Møbler",
    slug: "mobler",
    description: "Møbler, interiør og unike ting til hjemmet.",
  },
  {
    name: "Fritid",
    slug: "fritid",
    description: "Produkter for hobby, aktivitet og fritid.",
  },
  {
    name: "Klær",
    slug: "klaer",
    description: "Brukte klær, vintage og tidløse plagg.",
  },
  {
    name: "Musikk",
    slug: "musikk",
    description: "Plater, musikkutstyr og andre musikalske funn.",
  },
  {
    name: "Annet",
    slug: "annet",
    description: "Unike gjenstander som ikke passer i de andre kategoriene.",
  },
];

export default function Categories() {
  return (
    <main className="flex flex-1 bg-main">
      <section className="w-full px-6 py-14 md:px-[6vw] md:py-20">
        <div className="mx-auto w-full max-w-6xl">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-12 text-center md:mb-16">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] opacity-70">
              Utforsk butikken
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Kategorier
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-80">
              Finn det du leter etter ved å utforske produktene våre etter
              kategori.
            </p>
          </div>


          {/* =========================
              CATEGORY CARDS
          ========================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="
                  group
                  relative
                  min-h-[190px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-card
                  p-7
                  text-left
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-white/20
                  hover:shadow-xl
                "
              >

                {/* Decorative background circle */}
                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    h-32
                    w-32
                    rounded-full
                    bg-white/5
                    transition-transform
                    duration-300
                    group-hover:scale-125
                  "
                />


                {/* Arrow */}
                <div
                  className="
                    absolute
                    right-6
                    top-6
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-lg
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:bg-white
                    group-hover:text-card
                  "
                >
                  →
                </div>


                {/* Category information */}
                <div className="relative flex h-full flex-col justify-end">
                  <h2 className="mb-2 text-2xl font-bold">
                    {category.name}
                  </h2>

                  <p className="max-w-[280px] text-sm leading-relaxed opacity-75">
                    {category.description}
                  </p>
                </div>

              </Link>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}