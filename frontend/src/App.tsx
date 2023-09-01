import React, { useContext } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <InnerApp />
        </AuthProvider>
      </Router>
    </div>
  );
};

const InnerApp: React.FC = () => {
  const context = useContext(AuthContext);
  const location = useLocation();

  if (context === undefined) {
    return <div>Loading...</div>;
  }

  const { loading } = context;

  const mainClasses =
    location.pathname === "/login" ? "py-10 h-full" : "py-10 lg:pl-72 h-full";

  return (
    <main className={mainClasses}>
      <div className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
