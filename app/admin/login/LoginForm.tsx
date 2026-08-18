"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

   // Runs when the login form is submitted
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
     // Prevents the browser from refreshing the page when submitting the form
    event.preventDefault();

    const supabase = createClient();

    // Ask Supabase Auth to verify the entered email and password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Display the Supabase error if authentication fails
    if (error) {
      setMessage(error.message);
      return;
    }

    // Login succeeded.
    // Supabase has now created an authenticated session for the browser.
    // Redirect to the protected admin page.
    window.location.href = "/admin";
  }

  return (
    <main>
      <h1>Admin login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">E-post</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Passord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">Logg inn</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}