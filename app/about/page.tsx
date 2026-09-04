import Link from "next/link";

export default function About() {
  return (
    <main className="flex-1 bg-main">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16 lg:px-12">

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

          <Link
                        href="/about"
                        className="font-semibold"
                    >
                        Om oss
                    </Link>

        </nav>
        

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] opacity-70">
            Merkatá Bruktbutikk
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Om oss
          </h1>

          <p className="mt-5 text-lg leading-relaxed opacity-80">
            Vi tror at gode ting fortjener mer enn ett liv.
          </p>
        </div>


        {/* =========================
            INTRO SECTION
        ========================= */}

        <section className="mb-12 grid overflow-hidden rounded-3xl border border-white/10 bg-card shadow-sm md:grid-cols-2">

          {/* Text */}
          <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] opacity-60">
              Hvem vi er
            </p>

            <h2 className="mb-5 text-2xl font-bold md:text-3xl">
              En lokal bruktbutikk med unike funn
            </h2>

            <div className="space-y-4 leading-relaxed opacity-85">
              <p>
                Velkommen til Merkatá Bruktbutikk. Hos oss finner du et
                spennende utvalg av brukte skatter, vintage, retro,
                antikviteter og andre unike gjenstander.
              </p>

              <p>
                Målet vårt er å gi kvalitetsprodukter et nytt liv og gjøre det
                enklere å velge gjenbruk.
              </p>

              <p>
                Utvalget vårt varierer, og derfor kan hvert besøk by på noe
                nytt.
              </p>
            </div>
          </div>


          {/* Image */}
          <div className="min-h-[320px] overflow-hidden md:min-h-[430px]">
            <img
              src="/forside_bilde.jpg"
              alt="Inne i Merkatá Bruktbutikk"
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

        </section>


        {/* =========================
            VALUES
        ========================= */}

        <section className="mb-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] opacity-70">
              Det vi står for
            </p>

            <h2 className="text-3xl font-bold">
              Hvorfor gjenbruk?
            </h2>
          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                ↻
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Nytt liv
              </h3>

              <p className="text-sm leading-relaxed opacity-75">
                Gjenstander som fortsatt har mye å gi, fortjener muligheten til
                å bli brukt igjen.
              </p>
            </div>


            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                ♢
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Unike funn
              </h3>

              <p className="text-sm leading-relaxed opacity-75">
                Brukt og vintage gir muligheten til å finne ting som skiller
                seg fra det du møter i vanlige butikker.
              </p>
            </div>


            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                ♧
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Mindre forbruk
              </h3>

              <p className="text-sm leading-relaxed opacity-75">
                Ved å velge brukt kan eksisterende produkter brukes lenger i
                stedet for å bli erstattet unødvendig.
              </p>
            </div>

          </div>
        </section>


        {/* =========================
            VISIT / CTA
        ========================= */}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-card p-7 shadow-sm md:p-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] opacity-60">
                Utforsk butikken
              </p>

              <h2 className="text-2xl font-bold md:text-3xl">
                Se hva vi har inne nå
              </h2>

              <p className="mt-3 leading-relaxed opacity-75">
                Produktene våre varierer hele tiden. Utforsk kategoriene våre
                og se hvilke bruktfunn som er tilgjengelige akkurat nå.
              </p>
            </div>


            <Link
              href="/categories"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-3
                rounded-xl
                px-6
                py-3
                font-semibold
                text-card
                transition
                duration-200
                bg-primary
                hover:bg-primary-dark
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >
              Se produkter

              <span>
                →
              </span>
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}