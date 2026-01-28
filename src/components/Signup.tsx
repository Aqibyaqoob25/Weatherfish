import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, login, saveToken } from "../services/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const hobbiesList = hobbies
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h);
      await signup(username, email, password, hobbiesList);
      // auto-login after signup
      const data = await login(username, password);
      saveToken(data.access_token);
      navigate("/app");
    } catch (err: any) {
      // Parse error message from JSON response
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.detail || "Signup failed");
      } catch {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Username</label>
        <input
          className="w-full mb-3 p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block mb-2">Email</label>
        <input
          className="w-full mb-3 p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full mb-3 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="block mb-2">Hobbies (comma-separated)</label>
        <input
          className="w-full mb-3 p-2 border"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="e.g. gaming, tennis, cycling"
        />
        <button className="bg-green-600 text-white px-4 py-2" type="submit">
          Sign up
        </button>
      </form>
      <p className="mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
