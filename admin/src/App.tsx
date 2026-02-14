import { useState } from "react";
import Login from "./Login";
import Products from "./Products";
import Sidebar from "./Sidebar";
import "./App.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("bloom-admin-token") ?? "",
  );

  const persistToken = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      localStorage.setItem("bloom-admin-token", trimmed);
    } else {
      localStorage.removeItem("bloom-admin-token");
    }
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    persistToken(newToken);
  };

  const handleLogout = () => {
    setToken("");
    persistToken("");
  };

  // Show login page if not authenticated
  if (!token.trim()) {
    return (
      <Login onLoginSuccess={handleLoginSuccess} apiBaseUrl={apiBaseUrl} />
    );
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Products apiBaseUrl={apiBaseUrl} token={token} />
      </div>
    </div>
  );
}

export default App;
