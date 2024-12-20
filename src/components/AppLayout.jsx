import { useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import NavBar from "./NavBar";
import Footer from "./Footer/Footer";

export default function AppLayout({ children, setIsModalOpen }) {
  const location = useLocation();

  // Check if the current route starts with `/admin`
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="h-full m-0 p-0 w-full">
      {/* Modal Component */}
      <AuthModal isOpen={false} onClose={() => setIsModalOpen(false)} />

      {/* Conditionally Render NavBar */}
      {!isAdminRoute && <NavBar />}

      {/* Main Content */}
      {children}

      {/* Conditionally Render Footer */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
