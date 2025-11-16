import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // <- This is your new file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* your other routes */}
      </Routes>
    </Router>
  );
}
