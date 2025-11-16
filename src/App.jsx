import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // <- Your Login component file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
