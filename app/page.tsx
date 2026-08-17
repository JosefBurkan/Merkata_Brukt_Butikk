import Link from "next/link";

export default function Home() {
  return (

    <main className="home-page">
      <section className="hero">
        <div className="hero-text">
          <h1>Velkommen til Merkatå Bruktbutikk</h1>

          <p>
            Hos oss finner du et spennende utvalg av brukte skatter, vintage,
            retro, antikviteter og unike gjenstander med historie.
          </p>

          <p>
            Vi tror at gjenbruk handler om mer enn å spare penger. Det handler
            om å ta vare på kvalitet, redusere unødvendig forbruk og gi gamle
            favoritter en ny eier.
          </p>

          <Link href="/about">Les mer</Link>
        </div>

        <div className="hero-image">
          <img
          className = "h-116 w-[100vw] lg::w-[50vw] overflow-hidden lg::absolute right-0 top-18"
          src = "/forside_bilde.jpg"
        />
        </div>
      </section>
    
      <section className="news-section">
        <h2>Nyheter</h2>

        <Link href="/categories">Se resten av produktene →</Link>

        <div className="product-list grid grid-cols-1 lg:grid-cols-3 gap-40 justify-items-center">
          <div className="product-card"></div>
          <div className="product-card"></div>
          <div className="product-card"></div>
        </div>
      </section>

      <section className="map-section">
        <h2>Google Maps Kart</h2>

        <div className="map-placeholder">
          Google Maps kommer her
        </div>
      </section>

      <section className="contact-section">
        <h2>Kontakt oss</h2>

        <div className="contact-info">
          <div>
            <h3>Adresse:</h3>
            <p>
              Schweigaards gate 92,
              <br />
              0190 Oslo
            </p>
          </div>

          <div>
            <h3>Telefon:</h3>
            <p>97 40 65 89</p>
          </div>

          <div>
            <h3>Åpningstider:</h3>
            <p>
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