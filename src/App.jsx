import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/Home/HomePage";
import AuthModal from "./components/AuthModal";
import AboutPage from "./components/AboutUs/About";
import ContactSection from "./components/ContactSection";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Router>
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
             {/* Routing Configuration */}
             <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
      
        </Routes>
      

    </div>
    <ContactSection/>
    </Router>
  );
}

export default App;
