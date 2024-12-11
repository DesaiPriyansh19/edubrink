import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <h1 className="text-5xl font-bold text-blue-800">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </h1>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
