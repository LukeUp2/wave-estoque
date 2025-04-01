"use client";
import { Plus } from "@phosphor-icons/react";

interface Props {
  openModal: () => void;
}

export function FloatingButton({ openModal }: Props) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center group">
      <span className="mr-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 -translate-x-2 transition-all duration-200 bg-green-700 text-white px-3 py-1 rounded shadow-md text-sm">
        Nova Camisa
      </span>
      <button
        onClick={openModal}
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition duration-200 active:scale-95"
      >
        <Plus size={24} weight="bold" />
      </button>
    </div>
  );
}
