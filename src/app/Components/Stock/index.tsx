"use client";
import Image from "next/image";
import { ArrowsClockwise, ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ShirtCard } from "../ShirtCard";
import { toast, Toaster } from "sonner";

export interface ICamisas {
  id: number;
  nome: string;
  cor: string;
  imagem: string;
  emEstoque: Estoque[];
}

export type Estoque = {
  total: number;
  tamanho: string;
};

export function Stock() {
  const [shirts, setShirts] = useState<ICamisas[] | null>(null);
  const [loading, setLoading] = useState(false);

  function handleButtonAction(shirt: ICamisas, stock: Estoque, delta: number) {
    const updated = shirts?.map((camisa) => {
      if (camisa.id === shirt.id) {
        // Atualiza a quantidade do tamanho correspondente
        const novosEstoques = camisa.emEstoque.map((item) => {
          if (item.tamanho === stock.tamanho) {
            return {
              ...item,
              total: Math.max(item.total + delta, 0), // evita número negativo
            };
          }
          return item;
        });

        return {
          ...camisa,
          emEstoque: novosEstoques,
        };
      }

      return camisa;
    });

    setShirts(updated!);
  }

  async function getData() {
    try {
      setLoading(true);
      var result = await fetch(
        "https://deploy-estoque-api.fly.dev/api/estoque",
        {}
      );
      const data = await result.json();
      setShirts(data.camisas);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center pb-24">
      <div className="mt-6 flex flex-1 justify-center items-center">
        <button
          onClick={getData}
          className="bg-black w-10 h-10 flex items-center justify-center rounded-full border-1 hover:scale-105 active:scale-95 active:bg-white/10 transition duration-150"
        >
          <ArrowsClockwise
            size={30}
            color="oklch(0.723 0.219 149.579)"
            className={loading ? "animate-spin duration-200" : ""}
          />
        </button>
      </div>
      {shirts ? (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2 mt-2 px-2 justify-center">
          {shirts.map((camisa, index) => {
            return (
              <ShirtCard
                handleButtonAction={handleButtonAction}
                key={index}
                camisa={camisa}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center animate-pulse mb-2">
            <ArrowUp size={16} />
            <h3>Aperte aqui para atualizar</h3>
          </div>
          <h1 className="font-medium text-3xl">Estoque vazio</h1>
        </div>
      )}
      <Toaster />
    </div>
  );
}
