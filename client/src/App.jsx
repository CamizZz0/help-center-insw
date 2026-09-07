import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaqPage from "./pages/FaqPage";
import SearchResultsPage from "./pages/SearchResultsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route
        path="/faq/:categorySlug"
        element={<FaqPage />}
      />
    </Routes>
  );
}