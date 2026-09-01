import Link from "next/link";
import { cookies } from "next/headers";

import { createClient } from "@/supabase/server";

import Carousel from "./components/Carousel";
import Map from "./components/Map";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  if (error) {
    console.error(
      "Error fetching products:",
      error
    );
  }

  return (
    <main className="w-full bg-page text-gray-900">

      {/* =========================
          HERO
      ========================= */}

      <section className="px-5 py-8 md:px-8 md:py-10 lg:px-12">

        <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-3xl border border-black/5 bg-hero shadow-sm lg:grid-cols-2">

          {/* Hero text */}
          <div className="flex flex-col justify-center px-7 py-12 sm:px-10 md:py-16 lg:px-14 lg:py-20">

            <div className="mb-5">
              <span className="inline-flex rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Brukt • Vintage • Retro
              </span>
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-[56px]">
              Unike ting fortjener et nytt liv.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-700 md:text-lg">
              Hos Merkatå finner du brukte skatter, vintage, retro,
              antikviteter og andre unike gjenstander med historie.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href="/categories"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-primary-dark
                  hover:shadow-md
                "
              >
                Se produkter
                <span>→</span>
              </Link>

              <Link
                href="/about"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-black/10
                  bg-card/70
                  px-6
                  py-3.5
                  font-semibold
                  text-gray-800
                  transition
                  duration-200

                  hover:bg-card
                  hover:shadow-sm
                "
              >
                Om oss
              </Link>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-600">

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Gjenbruk
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Unike funn
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Lokalt i Oslo
              </div>

            </div>

          </div>


          {/* Hero image */}
          <div className="relative min-h-[330px] overflow-hidden lg:min-h-[560px]">

            <img
              src="/forside_bilde.jpg"
              alt="Inne i Merkatå Bruktbutikk"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/[0.04]" />

          </div>

        </div>

      </section>


      {/* =========================
          LATEST PRODUCTS
      ========================= */}

      <section className="px-5 py-14 md:px-8 md:py-16 lg:px-12">

        <div className="mx-auto w-full max-w-7xl">

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                Nytt i butikken
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Nyeste produkter
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Ta en titt på noen av de nyeste bruktfunnene som har kommet inn.
              </p>

            </div>


            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 font-semibold text-gray-700 transition hover:text-brand"
            >
              Se alle produkter

              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>

          <Carousel newProducts={products ?? []} />

        </div>

      </section>


      {/* =========================
          VISIT US
      ========================= */}

      <section className="border-y border-black/5 bg-section px-5 py-16 md:px-8 md:py-20 lg:px-12">

        <div className="mx-auto w-full max-w-7xl">

          {/* Section heading */}
          <div className="mb-8 max-w-2xl">

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              Besøk oss
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Finn oss på Vålerenga
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Kom innom butikken og se utvalget selv. Vi holder til i
              Schweigaards gate 92 i Oslo.
            </p>

          </div>


          {/* Map */}
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-card shadow-sm">
            <Map />
          </div>


          {/* =========================
              CONTACT CARDS
          ========================= */}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Address */}
            <div className="rounded-2xl border border-black/10 bg-card p-6 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />

                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                  />
                </svg>

              </div>

              <p className="text-sm font-medium text-gray-500">
                Adresse
              </p>

              <h3 className="mt-1 font-semibold text-gray-900">
                Schweigaards gate 92
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                0190 Oslo
              </p>

            </div>


            {/* Phone */}
            <div className="rounded-2xl border border-black/10 bg-card p-6 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                </svg>

              </div>

              <p className="text-sm font-medium text-gray-500">
                Telefon
              </p>

              <h3 className="mt-1 font-semibold text-gray-900">
                97 40 65 89
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Ring oss gjerne
              </p>

            </div>


            {/* Opening hours */}
            <div className="rounded-2xl border border-black/10 bg-card p-6 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="M12 7v5l3 2" />
                </svg>

              </div>

              <p className="text-sm font-medium text-gray-500">
                Åpningstider
              </p>

              <h3 className="mt-1 font-semibold text-gray-900">
                Tir–Fre 11–18
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Lør–Søn 12–18
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}