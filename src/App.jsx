import React, { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/Home/HomePage";
import AuthModal from "./components/AuthModal";
import AboutPage from "./components/AboutUs/About";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-full m-0 p-0 w-full  ">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Modal
      </button>

      {/* Modal Component */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <NavBar />
      <HomePage />
      <AboutPage />
    </div>
  );
}

export default App;
