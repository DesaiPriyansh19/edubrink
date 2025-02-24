import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { trackPageView } from "../utils/google-analytics";
import Blog from "../src/components/Blog/Blog";
import MoreInfo from "./components/Blog/Blog";
import AdminLayout from "./components/AdminPanelClient/AdminLayout";
import Dashboard from "./components/AdminPanelClient/Dashboard";
import CountryCRUD from "./components/AdminPanelClient/Countries/CountryCRUD";
import UniCRUD from "./components/AdminPanelClient/Universities/UniCRUD";
import AddCountry from "./components/AdminPanelClient/Countries/AddCountry";
import AddUniversity from "./components/AdminPanelClient/Universities/AddUniversity";
import FacultyCRUD from "./components/AdminPanelClient/Faculties/FacultyCRUD";
import AddFaculty from "./components/AdminPanelClient/Faculties/AddFaculty";
import MajorCRUD from "./components/AdminPanelClient/Majors/MajorCRUD";
import AddMajor from "./components/AdminPanelClient/Majors/AddMajor";
import CourseCRUD from "./components/AdminPanelClient/Courses/CourseCRUD";
import AddCourse from "./components/AdminPanelClient/Courses/AddCourse";
import ArticlesCRUD from "./components/AdminPanelClient/Articles/ArticlesCRUD";
import AddArticle from "./components/AdminPanelClient/Articles/AddArticles";
import UsersCRUD from "./components/AdminPanelClient/Users/UsersCRUD";
import AddUser from "./components/AdminPanelClient/Users/AddUser";
import EditCountry from "./components/AdminPanelClient/Countries/EditCountry";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.includes("/admin");

  return (
    <LanguageProvider>
      <AnalysisProvider>
        <SearchProvider>
          <div
            className={
              isAdminRoute ? "w-full" : "max-w-[1440px] w-full mx-auto"
            }
          >
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
                  <Route path="/:lang/blog" element={<MoreInfo />} />
                  <Route path="/:lang/contact" element={<ContactUs />} />
                  <Route path="/:lang/blog/:slug" element={<Blog />} />
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
                  
                  {/* <Route
                    path="/:lang/admin"
                    element={<NavigateToAdminDashboard />}
                  /> */}
                  <Route path="/:lang/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="countries" element={<CountryCRUD />} />
                    <Route path="countries/add" element={<AddCountry />} />
                    <Route path="countries/:id" element={<EditCountry />} />
                    <Route path="universities" element={<UniCRUD />} />
                    <Route
                      path="universities/add"
                      element={<AddUniversity />}
                    />
                    <Route path="faculties" element={<FacultyCRUD />} />
                    <Route path="faculties/add" element={<AddFaculty />} />
                    <Route path="majors" element={<MajorCRUD />} />
                    <Route path="majors/add" element={<AddMajor />} />
                    {/* <Route
                      path="universities/:id"
                      element={<UniversityDetails />}
                    /> */}
                    <Route path="courses" element={<CourseCRUD />} />
                    <Route path="courses/add" element={<AddCourse />} />
                    <Route path="articles" element={<ArticlesCRUD />} />
                    <Route path="articles/add" element={<AddArticle />} />
                    <Route path="users" element={<UsersCRUD />} />
                    <Route path="users/add" element={<AddUser />} />
                  </Route>
                </Route>
              </Routes>
            </AppLayout>

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
