import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaqPage from "./pages/FaqPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import GuidesPage from "./pages/GuidesPage";
import TutorialsPage from "./pages/TutorialsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/panduan" element={<GuidesPage />} />
      <Route path="/tutorial" element={<TutorialsPage />} />

      <Route
        path="/faq/:categorySlug"
        element={<FaqPage />}
      />
    </Routes>
  );
}