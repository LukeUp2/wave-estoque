"use client";
import { useState } from "react";
import { FloatingButton } from "./Components/FloatingButton";
import { Header } from "./Components/Header";
import { Stock } from "./Components/Stock";
import { ModalNewShirt } from "./Components/ModalNewShirt";
import { ModalAddStock } from "./Components/ModalAddStock";

export default function Home() {
  const [modalIsOpened, setModalIsOpened] = useState(false);

  function openModal() {
    setModalIsOpened(true);
  }

  return (
    <>
      <main className="bg-black min-h-screen min-w-screen text-white">
        <Header />
        <Stock />

        <ModalNewShirt open={modalIsOpened} handleOpened={setModalIsOpened} />
        <FloatingButton openModal={openModal} />
      </main>
    </>
  );
}
