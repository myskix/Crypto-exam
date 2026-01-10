import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote"; // Ini akan kita buat setelah ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/view/:id" element={<ViewNote />} />
      </Routes>
    </Router>
  );
}

export default App;
