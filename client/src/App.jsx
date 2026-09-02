import { Routes, Route } from "react-router-dom";
import FaqPage from "./pages/FaqPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FaqPage />} />
    </Routes>
  );
}

export default App;