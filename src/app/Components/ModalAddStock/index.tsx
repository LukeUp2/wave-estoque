import { X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { ICamisas } from "../Stock";

interface EstoqueItem {
  tamanho: string;
  total: number;
}

interface ModalAdicionarEstoqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camisa: ICamisas;
}

export function ModalAddStock({
  open,
  onOpenChange,
  camisa,
}: ModalAdicionarEstoqueProps) {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [tamanho, setTamanho] = useState("M");
  const [quantidade, setQuantidade] = useState(0);

  const adicionarItem = () => {
    if (quantidade > 0) {
      setEstoque((prev) => [...prev, { tamanho, total: quantidade }]);
      setQuantidade(0);
      setTamanho("M");
    }
  };

  const removerItem = (index: number) => {
    setEstoque((prev) => prev.filter((_, i) => i !== index));
  };

  const salvarEstoque = async () => {
    var estoqueToApi = estoque.map((item) => {
      var found = camisa.emEstoque.findIndex((x) => x.tamanho == item.tamanho);
      if (found !== -1) {
        return {
          ...item,
          total: camisa.emEstoque[found].total + item.total,
        };
      }

      return item;
    });

    const payload = {
      estoque: estoqueToApi,
    };

    try {
      await fetch(
        `https://deploy-estoque-api.fly.dev/api/estoque/${camisa.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setEstoque([]);
      onOpenChange(false);
      toast.success("Estoque adicionado com sucesso!");
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-2">
            Adicionar Estoque
          </Dialog.Title>

          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className="p-2 border rounded w-1/3"
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
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                placeholder="Quantidade"
                className="p-2 border rounded w-2/3"
              />
              <button
                onClick={adicionarItem}
                className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
              >
                +
              </button>
            </div>

            <div className="space-y-1">
              {estoque.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-zinc-100 px-3 py-2 rounded border"
                >
                  <span>
                    {item.tamanho} — {item.total} unidade(s)
                  </span>
                  <button
                    onClick={() => removerItem(index)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={salvarEstoque}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            >
              Salvar
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
