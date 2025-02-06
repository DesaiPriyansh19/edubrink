import { useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import NavBar from "./NavBar";
import Footer from "./Footer/Footer";

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

      {/* Conditionally Render Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
