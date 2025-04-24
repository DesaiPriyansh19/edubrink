"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { SearchProvider } from "../context/SearchContext";
import { LanguageProvider } from "../context/LanguageContext";
import LanguageRedirect from "./components/LanguageRedirect";
import ProtectedRoute from "../utils/ProtectedRoute";
import AdminProtectedRoute from "../utils/AdminProtectedRoute";
import AuthModal from "./components/AuthModal";
import { trackPageView } from "../utils/google-analytics";
import AppLayout from "./components/AppLayout";
import NotFoundPage from "./components/404Page/404Page";

// Lazy load components to reduce initial bundle size
const HomePage = lazy(() => import("./components/Home/HomePage"));
const AboutPage = lazy(() => import("./components/AboutUs/About"));
const ContactUs = lazy(() => import("./components/ContactUs/ContactUs"));
const CountryPage = lazy(() => import("./components/CountryPage/CountryPage"));
const SearchResults = lazy(() => import("./components/Search/SearchResults"));
const UniversityPage = lazy(() =>
  import("./components/UniversityPage/UniversityPage")
);
const CoursePage = lazy(() => import("./components/CoursesPage/Courses"));
const MajorPage = lazy(() => import("./components/MajorPage/MajorPage"));
const Blog = lazy(() => import("./components/Blog/Blog"));
const MoreInfo = lazy(() => import("./components/Blog/Blog"));
const FacultyPage = lazy(() => import("./components/FacultyPage/FacultyPage"));
const ApplyForm = lazy(() => import("../utils/ApplyForm"));

// Admin components
const AdminLayout = lazy(() =>
  import("./components/AdminPanelClient/AdminLayout")
);
const Dashboard = lazy(() => import("./components/AdminPanelClient/Dashboard"));
const CountryCRUD = lazy(() =>
  import("./components/AdminPanelClient/Countries/CountryCRUD")
);
const AddCountry = lazy(() =>
  import("./components/AdminPanelClient/Countries/AddCountry")
);
const EditCountry = lazy(() =>
  import("./components/AdminPanelClient/Countries/EditCountry")
);
const UniCRUD = lazy(() =>
  import("./components/AdminPanelClient/Universities/UniCRUD")
);
const AddUniversity = lazy(() =>
  import("./components/AdminPanelClient/Universities/AddUniversity")
);
const EditUniversity = lazy(() =>
  import("./components/AdminPanelClient/Universities/EditUniversity")
);
const FacultyCRUD = lazy(() =>
  import("./components/AdminPanelClient/Faculties/FacultyCRUD")
);
const AddFaculty = lazy(() =>
  import("./components/AdminPanelClient/Faculties/AddFaculty")
);
const EditFaculty = lazy(() =>
  import("./components/AdminPanelClient/Faculties/EditFaculty")
);
const MajorCRUD = lazy(() =>
  import("./components/AdminPanelClient/Majors/MajorCRUD")
);
const AddMajor = lazy(() =>
  import("./components/AdminPanelClient/Majors/AddMajor")
);
const EditMajor = lazy(() =>
  import("./components/AdminPanelClient/Majors/EditMajor")
);
const CourseCRUD = lazy(() =>
  import("./components/AdminPanelClient/Courses/CourseCRUD")
);
const AddCourse = lazy(() =>
  import("./components/AdminPanelClient/Courses/AddCourse")
);
const EditCourse = lazy(() =>
  import("./components/AdminPanelClient/Courses/EditCourse")
);
const ArticlesCRUD = lazy(() =>
  import("./components/AdminPanelClient/Articles/ArticlesCRUD")
);
const AddArticle = lazy(() =>
  import("./components/AdminPanelClient/Articles/AddArticles")
);
const EditArticle = lazy(() =>
  import("./components/AdminPanelClient/Articles/EditArticles")
);
const UsersCRUD = lazy(() =>
  import("./components/AdminPanelClient/Users/UsersCRUD")
);
const AddUser = lazy(() =>
  import("./components/AdminPanelClient/Users/AddUser")
);
const EditUser = lazy(() =>
  import("./components/AdminPanelClient/Users/EditUser")
);
const TagCRUD = lazy(() =>
  import("./components/AdminPanelClient/Tags/TagCRUD")
);
const ApplyCRUD = lazy(() =>
  import("./components/AdminPanelClient/Applies/ApplyCRUD")
);
const ApplicationDetails = lazy(() =>
  import("./components/AdminPanelClient/Applies/ApplicationDetails")
);

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b3d8d]"></div>
  </div>
);

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
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/en" replace />} />
                <Route path="*" element={<NotFoundPage />} />{" "}
                {/* Catch-all route */}
                <Route path="/:lang" element={<HomePage />} />
                <Route path="/:lang/about" element={<AboutPage />} />
                <Route path="/:lang/blog" element={<MoreInfo />} />
                <Route path="/:lang/contact" element={<ContactUs />} />
                <Route path="/:lang/country/:slug" element={<CountryPage />} />
                <Route
                  path="/:lang/university/:slug"
                  element={<UniversityPage />}
                />
                <Route path="/:lang/faculty/:slug" element={<FacultyPage />} />
                <Route path="/:lang/courses/:id" element={<CoursePage />} />
                <Route path="/:lang/major/:slug" element={<MajorPage />} />
                <Route path="/:lang/blog/:slug" element={<Blog />} />
                <Route
                  path="/:lang/searchresults/*"
                  element={<SearchResults />}
                />
                {/* Protected Routes (All except HomePage) */}
                <Route
                  element={<ProtectedRoute setIsModalOpen={setIsModalOpen} />}
                >
                  <Route
                    path="/:lang/applications/:itemId"
                    element={<ApplyForm />}
                  />
                </Route>
                {/* Admin Protected Routes */}
                <Route element={<AdminProtectedRoute />}>
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
                    <Route path="faculties/:id" element={<EditFaculty />} />
                    <Route path="majors" element={<MajorCRUD />} />
                    <Route path="majors/add" element={<AddMajor />} />
                    <Route path="majors/:id" element={<EditMajor />} />
                    <Route
                      path="universities/:id"
                      element={<EditUniversity />}
                    />
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
            </Suspense>
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
