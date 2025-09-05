import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/header";
import Footer from "../Components/footer";

export default function PublicLayout() {
  return (
    <>
      <header className="absolute w-full pt-4">
        <Navbar />
      </header>

      <main className="">
        <Outlet />
      </main>
      <footer className="">
        <Footer/>
      </footer>
    </>
  );
}
