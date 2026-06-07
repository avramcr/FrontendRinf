"use client";

import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AprobareItPage() {
  const [comenzi, setComenzi] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function getComenzi() {
    setMsg("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/comenzi/comenziDepartamentIt",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setComenzi(data);
      } else {
        setMsg(data.message || "A apărut o eroare.");
      }
    } catch (error) {
      setMsg("Nu mă pot conecta la server.");
    } finally {
      setLoading(false);
    }
  }

  async function aprobaComanda(id: number) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/comenzi/${id}/aprobare-it`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        alert("Comanda a fost aprobată!");
        getComenzi();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Eroare la aprobare");
    }
  }

  async function respingeComanda(id: number) {
    const comentariu = prompt("Introdu motivul respingerii:");
    if (!comentariu) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/comenzi/${id}/respingere`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comentariu,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Comanda a fost respinsă!");
        getComenzi();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Eroare la respingere");
    }
  }

  useEffect(() => {
    getComenzi();
  }, []);

  return (
    <main
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/registerBackground.png')" }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          href="/login"
          className="font-bold bg-blue-400 hover:bg-blue-700 text-black p-2 rounded-xl disabled:opacity-50 mt-2"
        >
          Deconectează-te
        </Link>
      </div>

      <div className="p-6 max-w-6xl w-full mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comenzi.map((comanda: any) => (
            <div
              key={comanda.id}
              className="border border-black/40 rounded-lg p-5 bg-white/80 shadow-md hover:shadow-lg transition-shadow w-full"
            >
              <h3 className="font-semibold text-2xl mb-1">{comanda.titlu}</h3>

              <p className="text-md text-gray-700 mb-2">{comanda.descriere}</p>

              <h4 className="text-md text-gray-700 mb-2">{comanda.status}</h4>

              <div className="text-sm text-gray-600 flex gap-2">
                <span>{comanda.categorie}</span>
                <span>•</span>
                <span>{comanda.suma} USD</span>
              </div>

              <div className="flex gap-80 mt-2">
                <button
                  onClick={() => aprobaComanda(comanda.id)}
                  className="font-bold bg-blue-400 hover:bg-blue-700 text-black p-2 rounded-xl disabled:opacity-50 mt-2"
                >
                  Aprobă
                </button>

                <button
                  onClick={() => respingeComanda(comanda.id)}
                  className="font-bold bg-red-400 hover:bg-red-700 text-black p-2 rounded-xl disabled:opacity-50 mt-2"
                >
                  Respinge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
