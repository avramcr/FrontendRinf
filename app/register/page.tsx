"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string): boolean => {
    return (
      email.includes("@") &&
      email.includes(".") &&
      email.indexOf("@") < email.lastIndexOf(".")
    );
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMsg("");

    if (!nume || !email || !parola) {
      setMsg("Completează toate câmpurile.");
      return;
    }

    if (!isValidEmail(email)) {
      setMsg("Introduceți un email valid.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/utilizatori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nume,
          email,
          parola,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("Utilizator creat cu succes!");
        setNume("");
        setEmail("");
        setParola("");
        setTimeout(() => router.push("/login"));

        return;
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
        className="bg-white/100 p-6 rounded-md opacity-90 space-y-5"
      >
        <h1 className="text-[30px] font-bold text-center mb-4">Înregistrare</h1>

        <div>
          <label className="text-sm font-bold">Nume</label>
          <input
            type="text"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

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
          {loading ? "Se trimite..." : "Înregistrează"}
        </button>

        {msg && <p className="text-center text-sm text-zinc-800">{msg}</p>}
      </form>
    </main>
  );
}
