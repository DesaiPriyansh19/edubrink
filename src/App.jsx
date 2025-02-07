import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/Home/HomePage";
import AppLayout from "./components/AppLayout";
import AboutPage from "./components/AboutUs/About";
import AdminPanelDashBoard from "./components/AdminPanel/AdminPanelDashBoard";
import CountryPage from "./components/CountryPage/CountryPage";
import ContactUs from "./components/ContactUs/ContactUs";
import SearchResults from "./components/Search/SearchResults";
import UniversityPage from "./components/UniversityPage/UniversityPage";
import CoursePage from "./components/CoursesPage/Courses";
import { SearchProvider } from "../context/SearchContext";
import { AnalysisProvider } from "../context/AnalysisContext";
import { LanguageProvider } from "../context/LanguageContext";
import LanguageRedirect from "./components/LanguageRedirect";
import ProtectedRoute from "../utils/ProtectedRoute";
import AuthModal from "./components/AuthModal";
import { NavigateToAdminDashboard } from "../utils/NavigateToAdminDashboard";
import UniversityLeftLayout from "./components/UniversityPage/UniversityLeftLayout";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LanguageProvider>
      <AnalysisProvider>
        <SearchProvider>
          <div className="max-w-[1440px] w-full mx-auto">
            <Router>
              <AppLayout>
                <LanguageRedirect />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/en" replace />} />
                  <Route path="/:lang" element={<HomePage />} />

                  {/* Protected Routes (All except HomePage) */}
                  <Route
                    element={<ProtectedRoute setIsModalOpen={setIsModalOpen} />}
                  >
                    <Route path="/:lang/about" element={<AboutPage />} />
                    <Route path="/:lang/contact" element={<ContactUs />} />
                    <Route
                      path="/:lang/country/:slug"
                      element={<CountryPage />}
                    />

                    <Route
                      path="/:lang/university/:slug"
                      element={<UniversityPage />}
                    />
                    <Route path="/:lang/courses/:id" element={<CoursePage />} />
                    <Route
                      path="/:lang/searchresults/*"
                      element={<SearchResults />}
                    />
                    <Route
                      path="/:lang/admin"
                      element={<NavigateToAdminDashboard />}
                    />
                    <Route
                      path="/:lang/admin/:slug"
                      element={<AdminPanelDashBoard />}
                    />
                  </Route>
                </Routes>
              </AppLayout>
            </Router>
            <AuthModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </SearchProvider>
      </AnalysisProvider>
    </LanguageProvider>
  );
}

export default App;
