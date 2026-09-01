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
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="w-full">

      {/* =========================
          HERO
      ========================= */}

      <section className="grid min-h-[380px] w-full grid-cols-1 bg-hero md:grid-cols-2">
        
        {/* Hero text */}
        <div className="flex flex-col items-start justify-center px-6 py-12 md:px-[7vw] md:py-[70px]">
          <h1 className="mb-6 max-w-[550px] text-3xl leading-tight font-bold md:text-4xl lg:text-[42px]">
            Velkommen til Merkatå Bruktbutikk
          </h1>

          <p className="mb-[18px] max-w-[620px] text-base leading-[1.65]">
            Hos oss finner du et spennende utvalg av brukte skatter, vintage,
            retro, antikviteter og unike gjenstander med historie.
          </p>

          <p className="mb-[18px] max-w-[620px] text-base leading-[1.65]">
            Vi tror at gjenbruk handler om mer enn å spare penger. Det handler
            om å ta vare på kvalitet, redusere unødvendig forbruk og gi gamle
            favoritter en ny eier.
          </p>

          <Link
            href="/about"
            className="mt-2 font-bold underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Les mer
          </Link>
        </div>

        {/* Hero image */}
        <div className="min-h-[250px] overflow-hidden md:min-h-[380px]">
          <img
            src="/forside_bilde.jpg"
            alt="Merkatå Bruktbutikk"
            className="h-full min-h-[250px] w-full object-cover md:min-h-[380px]"
          />
        </div>
      </section>


      {/* =========================
          NEWS
      ========================= */}

      <section className="w-full bg-main px-6 py-14 text-center md:px-[6vw]">
        <h2 className="mb-2 text-[26px] font-bold">
          Nyheter
        </h2>

        <Link
          href="/categories"
          className="mb-9 inline-block text-sm hover:underline"
        >
          Se resten av produktene →
        </Link>

        <Carousel newProducts={products ?? []} />
      </section>


      {/* =========================
          MAP
      ========================= */}

      <section className="w-full bg-main px-6 pb-[60px] pt-[30px] text-center md:px-[6vw]">
        <h2 className="mb-[22px] text-[22px] font-bold">
          Her hører vi til
        </h2>

        <div className="mx-auto w-full max-w-7xl">
          <Map />
        </div>
      </section>


      {/* =========================
          CONTACT
      ========================= */}

      <section className="w-full bg-main px-6 pb-[65px] pt-[35px] text-center md:px-[6vw]">
        <h2 className="mb-10 text-[22px] font-bold">
          Kontakt oss
        </h2>

        <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 gap-[30px] md:grid-cols-3 md:gap-[50px]">

          {/* Address */}
          <div>
            <h3 className="mb-2 text-base font-bold">
              Adresse:
            </h3>

            <p className="text-[15px] leading-[1.6]">
              Schweigaards gate 92,
              <br />
              0190 Oslo
            </p>
          </div>

          {/* Phone */}
          <div>
            <h3 className="mb-2 text-base font-bold">
              Telefon:
            </h3>

            <p className="text-[15px] leading-[1.6]">
              97 40 65 89
            </p>
          </div>

          {/* Opening hours */}
          <div>
            <h3 className="mb-2 text-base font-bold">
              Åpningstider:
            </h3>

            <p className="text-[15px] leading-[1.6]">
              Tir-Fre 11-18
              <br />
              Lør-Søn 12-18
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}