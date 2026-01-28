import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./contexts/WeatherContext";
import { LocationProvider } from "./contexts/LocationContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  // Aktuellen Standortindex verwalten (0–3)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <Router>
      <LocationProvider>
        <WeatherProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </WeatherProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;
