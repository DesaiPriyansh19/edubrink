import { Navigate, useParams } from "react-router-dom";

export const NavigateToAdminDashboard = () => {
  const { lang } = useParams(); // Access the `lang` parameter from the URL

  // Redirect to the `/admin/dashboard` page for the given `lang`
  return <Navigate to={`/${lang}/admin/dashboard`} />;
};
