import { useState } from "react";
import axios from "axios";
import "./Login.css";

type LoginProps = {
  onLoginSuccess: (token: string) => void;
  apiBaseUrl: string;
};

type LoginResponse = {
  token: string;
  admin?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
  };
};

function Login({ onLoginSuccess, apiBaseUrl }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = (path: string) => `${apiBaseUrl.replace(/\/$/, "")}${path}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        apiUrl("/api/admin/login"),
        { username: username.trim(), password },
        { headers: { "Content-Type": "application/json" } },
      );

      const token = response.data.token;
      onLoginSuccess(token);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark" aria-hidden="true" />
          <h1>Bloom Life Admin</h1>
          <p>Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
