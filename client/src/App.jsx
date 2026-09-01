import { Route, Routes } from "react-router";
import FaqAllPage from "./pages/FaqAllPage";
import FaqCategoryPage from "./pages/FaqCategoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FaqAllPage />} />
      <Route path="/faq/:categorySlug" element={<FaqCategoryPage />} />
    </Routes>
  );
}

export default App;