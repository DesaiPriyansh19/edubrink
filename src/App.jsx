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
import Footer from "./components/Footer/Footer";
import AdminPanelDashBoard from "./components/AdminPanel/AdminPanelDashBoard";
import AppLayout from "./components/AppLayout";
import CountryPage from "./components/CountryPage/CountryPage";
import Courses from "./components/CoursesPage/Courses";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1440px] w-full mx-auto">
      <Router>
        <div className="h-full m-0 p-0 w-full">
          <AppLayout setIsModalOpen={setIsModalOpen}>
            {/* Routing Configuration */}
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Protected Routes */}
              <Route
                element={<ProtectedRoute setIsModalOpen={setIsModalOpen} />}
              >
                <Route path="/about" element={<AboutPage />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/contact" element={<ContactSection />} />
                <Route path="/country" element={<CountryPage />}></Route>
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" />}
                />

                {/* Dynamic slug route */}
                <Route path="/admin/:slug" element={<AdminPanelDashBoard />} />
              </Route>
            </Routes>
          </AppLayout>
        </div>
      </Router>
    </div>
  );
}

export default App;
