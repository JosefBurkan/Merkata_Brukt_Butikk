'use client'; // Required for hooks and event handlers
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function Home() {

    const router = useRouter();

  return (
      <main>
        <h1 style={{ color: "black", marginTop: "10px" }}>Velkommen til Merkatå bruktbutikk</h1>
      <p style={{ color: "black", marginTop: "10px" }}>
        
        <br/>Hos oss finner du et spennende utvalg av brukte skatter, vintage, retro, antikviteter og unike gjenstander med historie. 
        <br/> Vi tror at gjenbruk handler om mer enn å spare penger.
        <br/> Det handler om å ta vare på kvalitet, redusere unødvendig forbruk og gi gamle favoritter en ny eier.
      </p>
          <button style={{ color: "black", marginTop: "10px" }}
          type="button"
          onClick={() => router.push('/about')}
        >
          Go to About Us
      </button>
      
      <img
        class = "h-128 w-128 overflow-hidden absolute right-0 top-0"
        src = "/forside_bilde.jpg"
      />
      </main>
  );
}
