'use client'; // Required for hooks and event handlers
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function Home() {

    const router = useRouter();

  return (
      <main>
          <button
          type="button"
          onClick={() => router.push('/aboutUs')}
        >
          Go to About Us
        </button>
      </main>
  );
}
