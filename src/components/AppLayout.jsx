import { useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import NavBar from "./NavBar";
import Footer from "./Footer/Footer";
import ScrollToTop from "../../utils/ScrollToTop";

export default function AppLayout({ children, setIsModalOpen }) {
  const location = useLocation();
  const lang = location.pathname.split("/")[1];
  const isAdminRoute = location.pathname.startsWith(`/${lang}/admin`);

  return (
    <>
      {/* Modal Component */}
      <AuthModal isOpen={false} onClose={() => setIsModalOpen(false)} />

      {/* Conditionally Render NavBar */}
      {!isAdminRoute && <NavBar />}

      {/* Main Content */}
      {children}
      <ScrollToTop />

      {/* Conditionally Render Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
