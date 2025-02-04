import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import  LanguageRedirect  from "./components/LanguageRedirect";

function App() {
  return (
    <LanguageProvider>
      <AnalysisProvider>
        <SearchProvider>
          <div className="max-w-[1440px] w-full mx-auto">
            <Router>
              <AppLayout>
                <LanguageRedirect />
                <Routes>
                  {/* Redirect to default language */}

                  {/* Define routes with language support */}
                  <Route path="/:lang" element={<HomePage />} />
                  <Route path="/:lang/about" element={<AboutPage />} />
                  <Route path="/:lang/contact" element={<ContactUs />} />
                  <Route
                    path="/:lang/country/:slug"
                    element={<CountryPage />}
                  />
                  <Route
                    path="/:lang/university"
                    element={<UniversityPage />}
                  />
                  <Route path="/:lang/courses/:id" element={<CoursePage />} />
                  <Route
                    path="/:lang/admin"
                    element={<Navigate to="/:lang/admin/dashboard" />}
                  />
                  <Route
                    path="/:lang/admin/:slug"
                    element={<AdminPanelDashBoard />}
                  />
                  <Route
                    path="/:lang/searchresults/*"
                    element={<SearchResults />}
                  />
                </Routes>
              </AppLayout>
            </Router>
          </div>
        </SearchProvider>
      </AnalysisProvider>
    </LanguageProvider>
  );
}

export default App;
