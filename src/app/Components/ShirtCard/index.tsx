"use client";
import { toast, Toaster } from "sonner";
import { Estoque, ICamisas } from "../Stock";
import { Plus, Minus } from "@phosphor-icons/react";
import { ModalAddStock } from "../ModalAddStock";
import { useState } from "react";

interface Props {
  camisa: ICamisas;
  handleButtonAction: (shirt: ICamisas, stock: Estoque, delta: number) => void;
}

export function ShirtCard({ camisa, handleButtonAction }: Props) {
  const [modalEstoqueAberto, setModalEstoqueAberto] = useState(false);
  function totalCount(camisa: ICamisas): number {
    var total = 0;
    camisa.emEstoque.forEach((item) => {
      total += item.total;
    });
    return total;
  }

  async function handleUpdate() {
    try {
      var request = {
        estoque: camisa.emEstoque,
      };
      const response = await fetch(
        `https://deploy-estoque-api.fly.dev/api/estoque/${camisa.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );
      if (response.ok) {
        console.log("alow");
        toast.success("Estoque atualizado com sucesso!");
      }
    } catch (error) {}
  }

  return (
    <div
      key={camisa.id}
      className="flex justify-center items-center flex-col border-1 border-gray-500 p-2 w-full max-w-[500px] rounded-md mt-4 hover:scale-101 duration-200 text-white px-2"
    >
      <h1>
        {camisa.nome.toLocaleUpperCase()} ({camisa.cor})
      </h1>
      <div className="mt-2">
        {/* <Image
                  alt={camisa.nome}
                  src={camisa.imagem}
                  width={120}
                  height={120}
                  className="rounded-md"
                /> */}
        <div className="flex flex-col items-center justify-center text-green-500 my-2">
          <h1>Tamanhos disponíveis:</h1>
          <button
            onClick={() => setModalEstoqueAberto(true)}
            className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center  hover:scale-105 active:scale-95 active:bg-white/10 transition duration-150 mt-2"
          >
            <Plus size={16} weight="bold" color="white" />
          </button>
        </div>

        {camisa.emEstoque.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-3.5">
            {camisa.emEstoque.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-40 h-40 flex flex-col items-center justify-center"
                >
                  <h2 className="font-extrabold text-xl">{item.tamanho}</h2>
                  <h3 className="font-medium text-green-500">{item.total}</h3>
                  <div className="flex items-center w-26 gap-2 h-12 justify-center px-2">
                    <button
                      onClick={() => handleButtonAction(camisa, item, -1)}
                      className="border-1 border-white rounded-full p-2 active:scale-95 active:bg-white/10 transition duration-150 hover:scale-104"
                    >
                      <Minus size={20} />
                    </button>
                    <button
                      onClick={() => handleButtonAction(camisa, item, 1)}
                      className="border-1 border-white rounded-full p-2 active:scale-95 active:bg-white/10 transition duration-150 hover:scale-104"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center my-2">
            <h1>Nenhum tamanho disponível</h1>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-4">
          <h1>Total de blusas: {totalCount(camisa)}</h1>
          <button
            onClick={handleUpdate}
            disabled={totalCount(camisa) <= 0}
            className="bg-green-500 w-28 h-10 rounded-lg mt-1 font-bold hover:scale-105 active:scale-95 active:bg-white/10 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>

      <ModalAddStock
        camisa={camisa}
        open={modalEstoqueAberto}
        onOpenChange={setModalEstoqueAberto}
      />
    </div>
  );
}
