import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaqPage from "./pages/FaqPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import GuidesPage from "./pages/GuidesPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import TutorialsPage from "./pages/TutorialsPage";
import TutorialDetailPage from "./pages/TutorialDetailPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/panduan" element={<GuidesPage />} />
        <Route path="/panduan/:slug" element={<GuideDetailPage />} />
        <Route path="/tutorial" element={<TutorialsPage />} />
        <Route path="/tutorial/:slug" element={<TutorialDetailPage />} />

        <Route
          path="/faq/:categorySlug"
          element={<FaqPage />}
        />
      </Routes>
    </>
  );
}