'use client'; // Required for hooks and event handlers
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function Home() {

    const router = useRouter();

  return (
      <main>
        <h1>Welcome to Our Store</h1>
        <p>Explore our collection of unique items!</p>
        <p>Click the button below to learn more about us.</p>
          <button
          type="button"
          onClick={() => router.push('/about')}
        >
          Go to About Us
        </button>
      </main>
  );
}
