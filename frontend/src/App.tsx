import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import ProjectsPage from "./pages/ProjectsPage";
import EnvironmentsPage from "./pages/EnvironmentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/environments" element={<EnvironmentsPage />} />
    </Routes>
  );
}

export default App;
