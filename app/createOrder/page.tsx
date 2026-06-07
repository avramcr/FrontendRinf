"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePage() {
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [categorie, setCategorie] = useState("");
  const [suma, setSuma] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMsg("");

    if (!titlu || !descriere || !categorie || !suma) {
      setMsg("Completează toate câmpurile.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/comenzi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titlu: titlu,
          descriere: descriere,
          categorie: categorie,
          suma: Number(suma),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMsg("Comandă creată cu succes!");

        setTitlu("");
        setDescriere("");
        setCategorie("");
        setSuma("");
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
        <h1 className="text-[30px] font-bold text-center mb-4">
          Adaugă comandă
        </h1>

        <div>
          <label className="text-sm font-bold">Titlu</label>
          <input
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-bold">Descriere</label>
          <input
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className=" text-sm font-bold">Categorie</label>
          <input
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-bold">Suma</label>
          <input
            type="number"
            value={suma}
            onChange={(e) => setSuma(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-bold bg-blue-400 hover:bg-blue-700 text-black p-2 rounded  disabled:opacity-50 mt-2"
        >
          {loading ? "Se trimite..." : "Trimite comanda"}
        </button>

        {msg && <p className="text-center text-sm text-zinc-700">{msg}</p>}
      </form>
    </main>
  );
}
