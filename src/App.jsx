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
import AppLayout from "./components/AppLayout";

import AboutPage from "./components/AboutUs/About";
import ContactSection from "./components/ContactSection";
import ProtectedRoute from "../utils/ProtectedRoute";

import AdminPanelDashBoard from "./components/AdminPanel/AdminPanelDashBoard";

import CountryPage from "./components/CountryPage/CountryPage";
import Courses from "./components/CoursesPage/Courses";
import ContactUs from "./components/ContactUs/ContactUs";
import SearchResults from "./components/Search/SearchResults";
import UniversityPage from "./components/UniversityPage/UniversityPage";
import CoursePage from "./components/CoursesPage/Courses";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1440px] w-full mx-auto">
      <Router>
        <AppLayout setIsModalOpen={setIsModalOpen}>
          {/* Routing Configuration */}
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/country/:slug" element={<CountryPage />} />
              <Route path="/university" element={<UniversityPage />} />
              <Route path="/courses" element={<CoursePage/>} />
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" />}
              />
              <Route path="/admin/:slug" element={<AdminPanelDashBoard />} />
              <Route path="/searchresults" element={<SearchResults/>} />
            </Route>
          </Routes>
        </AppLayout>
      </Router>
    </div>
  );
}

export default App;
