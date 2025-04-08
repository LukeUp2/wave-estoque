// components/ModalNovaCamisa.tsx

"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowsClockwise, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  handleOpened: (open: boolean) => void;
}

export function ModalNewShirt({ open, handleOpened }: Props) {
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [cor, setCor] = useState("");
  const [usarEstoque, setUsarEstoque] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estoque, setEstoque] = useState<{ tamanho: string; total: number }[]>(
    []
  );
  const [tamanhoAtual, setTamanhoAtual] = useState("M");
  const [quantidadeAtual, setQuantidadeAtual] = useState(0);

  const adicionarEstoque = () => {
    if (quantidadeAtual <= 0) return;

    setEstoque((prev) => [
      ...prev,
      { tamanho: tamanhoAtual, total: quantidadeAtual },
    ]);
    setQuantidadeAtual(0);
    setTamanhoAtual("M");
  };

  const removerTamanho = (index: number) => {
    setEstoque((prev) => prev.filter((_, i) => i !== index));
  };

  const enviar = async () => {
    setLoading(true);
    const payload = {
      nome,
      sigla,
      cor,
      ...(usarEstoque && estoque.length > 0 ? { estoque } : {}),
    };

    try {
      await fetch("https://deploy-estoque-api.fly.dev/api/camisa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log(error);
    } finally {
      handleOpened(false);
      setLoading(false);
      resetStates();
      toast.success("Camisa cadastrada com sucesso!");
    }
  };

  const resetStates = () => {
    setNome("");
    setSigla("");
    setCor("");
    setUsarEstoque(false);
    setEstoque([]);
  };
  return (
    <Dialog.Root open={open} onOpenChange={handleOpened}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50",
            "w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-xl"
          )}
        >
          <Dialog.Title className="text-xl font-bold text-zinc-800 dark:text-white">
            Nova Camisa
          </Dialog.Title>

          <Dialog.Description className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Adicione uma nova camisa ao estoque.
          </Dialog.Description>

          <div className="space-y-3">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="w-full p-3 rounded border border-zinc-300"
            />
            <input
              value={sigla}
              onChange={(e) => setSigla(e.target.value)}
              placeholder="Sigla"
              className="w-full p-3 rounded border border-zinc-300"
            />
            <input
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              placeholder="Cor"
              className="w-full p-3 rounded border border-zinc-300"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usarEstoque}
                onChange={(e) => setUsarEstoque(e.target.checked)}
              />
              Deseja cadastrar estoque inicial?
            </label>

            {usarEstoque && (
              <div className="border p-4 rounded space-y-3 bg-zinc-100">
                <div className="flex gap-2">
                  <select
                    value={tamanhoAtual}
                    onChange={(e) => setTamanhoAtual(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XG">XG</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={quantidadeAtual}
                    onChange={(e) => setQuantidadeAtual(Number(e.target.value))}
                    placeholder="Quantidade"
                    className="p-2 border rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={adicionarEstoque}
                    className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="space-y-1">
                  {estoque.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white px-3 py-2 rounded border"
                    >
                      <span>
                        {item.tamanho} — {item.total} unidade(s)
                      </span>
                      <button
                        onClick={() => removerTamanho(index)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={enviar}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
            >
              {loading ? (
                <ArrowsClockwise
                  size={24}
                  color="oklch(0.723 0.219 149.579)"
                  className="animate-spin duration-200 justify-self-center"
                />
              ) : (
                "Salvar"
              )}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
