"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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

      console.log("status", response.status);
      console.log("data", data);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("utilizatorId", data.utilizator.id);

      if (response.ok) {
        setMsg("Utilizator creat cu succes!");

        setEmail("");
        setParola("");
        setTimeout(() => router.push("/getOrder"));
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
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/registerBackground.png')" }}
    >
      <form
        onSubmit={onSubmit}
        className="bg-white/100 p-6 rounded-md opacity-90 space-y-5"
      >
        <h1 className="text-[30px] font-bold text-center mb-4">Logare</h1>

        <div>
          <label className="text-sm font-bold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-bold">Parolă</label>
          <input
            type="password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-bold bg-blue-400 hover:bg-blue-700 text-black p-2 rounded  disabled:opacity-50 mt-2"
        >
          {loading ? "Se trimite..." : "Conectare"}
        </button>

        {msg && <p className="text-center text-sm text-zinc-700">{msg}</p>}

        <p className="text-center text-sm text-zinc-800 ">
          Nu ai cont?{" "}
          <Link href="/register" className=" font-semibold hover:underline">
            Înregistrază-te
          </Link>
        </p>
      </form>
    </main>
  );
}
