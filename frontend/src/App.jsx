import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmissionList from "./pages/SubmissionList";
import LandingPage from "./pages/LandingPage";
import { API_URL } from "./utils/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateNote />} />
        <Route path="/view/:id" element={<ViewNote />} />
        <Route path="/results/:id" element={<SubmissionList />} />
      </Routes>
    </Router>
  );
}

export default App;
