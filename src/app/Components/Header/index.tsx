"use client";
import { InstagramLogo } from "@phosphor-icons/react";
import Image from "next/image";

export function Header() {
  return (
    <div className="bg-black relative flex justify-between items-center shadow-green-500 shadow-md px-3 py-2">
      <div>
        <Image src={"/icon.jpg"} width={80} height={80} alt="wave-logo" />
      </div>

      <h1 className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl sm:text-3xl md:text-4xl text-white pl-8">
        Controle de Estoque
      </h1>
    </div>
  );
}
