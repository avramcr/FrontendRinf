"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMsg("");

    if (!email || !parola) {
      setMsg("Completează toate câmpurile.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/utilizatori/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          parola,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("Utilizator creat cu succes!");

        setEmail("");
        setParola("");
      } else {
        setMsg(data.message || "A apărut o eroare.");
      }
    } catch (error) {
      setMsg("Nu mă pot conecta la server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/registerBackground.png')",
      }}
    >
      <form
        onSubmit={onSubmit}
        className="p-6 border rounded-md space-y-4 w-96"
      >
        <h1 className="text-2xl font-bold text-center">Logare</h1>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Parolă</label>
          <input
            type="password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Se trimite..." : "Logare"}
        </button>

        {msg && <p className="text-center font-bold">{msg}</p>}
      </form>
    </main>
  );
}
