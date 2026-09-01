export default function Footer() {
  return (
    <footer className="w-full bg-footer px-6 pb-[18px] pt-[45px] md:px-[6vw]">

      {/* Main footer content */}
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-[30px] md:grid-cols-3 md:gap-[60px]">

        {/* Store information */}
        <div>
          <h3 className="mb-[14px] text-base font-bold">
            MERKATÁ BRUKTBUTIKK
          </h3>

          <p className="max-w-[280px] text-sm leading-[1.5]">
            Din lokale bruktbutikk som selger autentiske
            gjenstander av høy kvalitet.
          </p>
        </div>


        {/* Opening hours */}
        <div>
          <h3 className="mb-[14px] text-base font-bold">
            Åpningstider:
          </h3>

          <p className="max-w-[280px] text-sm leading-[1.5]">
            Tir-Fre 11-18
            <br />
            Lør-Søn 12-18
          </p>
        </div>


        {/* Contact information */}
        <div>
          <h3 className="mb-[14px] text-base font-bold">
            Kontaktinformasjon:
          </h3>

          <p className="max-w-[280px] text-sm leading-[1.5]">
            Schweigaards gate 92,
            <br />
            0190 Oslo
            <br />
            97 40 65 89
          </p>
        </div>

      </div>


      {/* Bottom footer */}
      <div className="mx-auto mt-10 flex w-full max-w-[1100px] flex-col gap-1 border-t border-black/30 pt-[14px] text-[11px] md:flex-row md:justify-between md:gap-5">

        <p>
          © 2026 Merkatå Bruktbutikk. Alle rettigheter reservert.
        </p>

        <p>
          Designed by Josef Burkan & Kenny Vo
        </p>

      </div>
    </footer>
  );
}