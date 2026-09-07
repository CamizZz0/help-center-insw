import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import FaqPage from "./pages/FaqPage";

export default function App() {
  return (
    <Routes>
      {/* Sementara diarahkan ke Impor & Kepabeanan.
          Nanti "/" diganti LandingPage. */}
      <Route
        path="/"
        element={
          <Navigate
            to="/faq/impor-kepabeanan"
            replace
          />
        }
      />

      <Route
        path="/faq/:categorySlug"
        element={<FaqPage />}
      />
    </Routes>
  );
}