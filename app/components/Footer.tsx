export default function Footer() {
  return (
    <footer className="w-full bg-footer text-white">

      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-8 lg:px-12">

        {/* =========================
            FOOTER CONTENT
        ========================= */}

        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">

          {/* Store */}
          <div>

            <h3 className="text-base font-bold">
              MERKATÅ BRUKTBUTIKK
            </h3>

            <p className="mx-auto mt-4 max-w-[300px] text-sm leading-6 text-white/65">
              Din lokale bruktbutikk med unike gjenstander,
              vintage, retro og brukte skatter.
            </p>

          </div>


          {/* Opening hours */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Åpningstider
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Tir–Fre 11–18
              <br />
              Lør–Søn 12–18
            </p>

          </div>


          {/* Contact */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Kontakt
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Schweigaards gate 92
              <br />
              0190 Oslo
              <br />
              97 40 65 89
            </p>

          </div>

        </div>


        {/* =========================
            FOOTER BOTTOM
        ========================= */}

        <div className="mt-10 border-t border-white/10 pt-6">

          <div className="flex flex-col items-center justify-center gap-2 text-center text-xs text-white/45 sm:flex-row sm:gap-6">

            <p>
              © 2026 Merkatá Bruktbutikk. Alle rettigheter reservert.
            </p>

            <span className="hidden text-white/20 sm:inline">
              •
            </span>

            <p>
              Designed by Josef Burkan & Kenny Vo
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}