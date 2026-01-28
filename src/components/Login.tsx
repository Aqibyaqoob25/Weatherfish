import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, saveToken } from "../services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(username, password);
      saveToken(data.access_token);
      navigate("/app");
    } catch (err: any) {
      // Parse error message from JSON response
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.detail || "Login failed");
      } catch {
        setError("Invalid username or password");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Username or Email</label>
        <input
          className="w-full mb-3 p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full mb-3 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">
          Login
        </button>
      </form>
      <p className="mt-3">
        No account?{" "}
        <Link to="/signup" className="text-blue-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}
