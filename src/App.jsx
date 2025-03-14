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
import CountryPage from "./components/CountryPage/CountryPage";
import ContactUs from "./components/ContactUs/ContactUs";
import SearchResults from "./components/Search/SearchResults";
import UniversityPage from "./components/UniversityPage/UniversityPage";
import CoursePage from "./components/CoursesPage/Courses";
import { SearchProvider } from "../context/SearchContext";
import { LanguageProvider } from "../context/LanguageContext";
import LanguageRedirect from "./components/LanguageRedirect";
import ProtectedRoute from "../utils/ProtectedRoute";
import AuthModal from "./components/AuthModal";
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
import EditUniversity from "./components/AdminPanelClient/Universities/EditUniversity";
import EditFaculty from "./components/AdminPanelClient/Faculties/EditFaculty";
import EditMajor from "./components/AdminPanelClient/Majors/EditMajor";
import EditCourse from "./components/AdminPanelClient/Courses/EditCourse";
import EditArticle from "./components/AdminPanelClient/Articles/EditArticles";
import EditUser from "./components/AdminPanelClient/Users/EditUser";
import TagCRUD from "./components/AdminPanelClient/Tags/TagCRUD";
import FacultyPage from "./components/FacultyPage/FacultyPage";
import ApplyCRUD from "./components/AdminPanelClient/Applies/ApplyCRUD";
import ApplicationDetails from "./components/AdminPanelClient/Applies/ApplicationDetails";
import ApplyForm from "../utils/ApplyForm";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.includes("/admin");

  return (
    <LanguageProvider>
      <SearchProvider>
        <div
          className={isAdminRoute ? "w-full" : "max-w-[1440px] w-full mx-auto"}
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

                <Route path="/:lang/country/:slug" element={<CountryPage />} />

                <Route
                  path="/:lang/university/:slug"
                  element={<UniversityPage />}
                />
                <Route
                  path="/:lang/applications/:itemId"
                  element={<ApplyForm />}
                />

                <Route path="/:lang/faculty/:slug" element={<FacultyPage />} />
                <Route path="/:lang/courses/:id" element={<CoursePage />} />
                <Route path="/:lang/blog/:slug" element={<Blog />} />
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
                  <Route path="universities/add" element={<AddUniversity />} />
                  <Route path="faculties" element={<FacultyCRUD />} />
                  <Route path="faculties/add" element={<AddFaculty />} />
                  <Route path="faculties/:id" element={<EditFaculty />} />
                  <Route path="majors" element={<MajorCRUD />} />
                  <Route path="majors/add" element={<AddMajor />} />
                  <Route path="majors/:id" element={<EditMajor />} />
                  <Route path="universities/:id" element={<EditUniversity />} />
                  <Route path="courses" element={<CourseCRUD />} />
                  <Route path="courses/add" element={<AddCourse />} />
                  <Route path="courses/:id" element={<EditCourse />} />
                  <Route path="articles" element={<ArticlesCRUD />} />
                  <Route path="articles/add" element={<AddArticle />} />
                  <Route path="articles/:id" element={<EditArticle />} />
                  <Route path="users" element={<UsersCRUD />} />
                  <Route path="users/add" element={<AddUser />} />
                  <Route path="users/:id" element={<EditUser />} />
                  <Route path="tags" element={<TagCRUD />} />
                  <Route path="applications" element={<ApplyCRUD />} />
                  <Route
                    path="applications/:id"
                    element={<ApplicationDetails />}
                  />
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
    </LanguageProvider>
  );
}

export default App;
