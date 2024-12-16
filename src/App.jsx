import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./components/Home/HomePage";
import AuthModal from "./components/AuthModal";
import AboutPage from "./components/AboutUs/About";
import ContactSection from "./components/ContactSection";
import ProtectedRoute from "../utils/ProtectedRoute";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1440px] w-full mx-auto">
      <Router>
        <div className="h-full m-0 p-0 w-full">
          {/* Modal Component */}
          <AuthModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          <NavBar />

          {/* Routing Configuration */}
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute setIsModalOpen={setIsModalOpen} />}>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactSection />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
