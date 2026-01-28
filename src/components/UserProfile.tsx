import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser, logout, deleteCurrentUser } from "../services/auth";

interface User {
  id: number;
  username: string;
  email: string;
  hobbies: string[];
}

const UserProfile: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", hobbies: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getCurrentUser();
        if (!mounted) return;
        setUser(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: "",
          hobbies: (data.hobbies || []).join(", ") || "",
        });
      } catch (err: any) {
        if (err?.message === "NOT_AUTHENTICATED") {
          // Redirect to login if not authenticated
          navigate("/login");
          return;
        }
        setError(err?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload: any = {};
      if (form.username !== user?.username) payload.username = form.username;
      if (form.email !== user?.email) payload.email = form.email;
      if (form.password) payload.password = form.password;
      payload.hobbies = form.hobbies
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const updated = await updateCurrentUser(payload);
      setUser(updated);
      setEditing(false);
      setForm({
        username: updated.username || "",
        email: updated.email || "",
        password: "",
        hobbies: (updated.hobbies || []).join(", ") || "",
      });
    } catch (err: any) {
      setError(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    // close menu if provided
    onClose?.();
    window.location.href = "/";
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!ok) return;
    setError(null);
    setLoading(true);
    try {
      await deleteCurrentUser();
      await logout();
      onClose?.();
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 w-64 text-gray-800">
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {!editing && user && (
        <div>
          <div className="font-semibold">{user.username}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
          <div className="text-sm mt-2">
            <strong>Hobbies:</strong>{" "}
            {(user.hobbies || []).join(", ")}
          </div>

          <div className="mt-3 flex justify-between">
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete account
              </button>
            </div>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div>
          <label className="block text-xs text-gray-600">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1 mb-2 text-sm"
          />

          <label className="block text-xs text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1 mb-2 text-sm"
          />

          <label className="block text-xs text-gray-600">New password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1 mb-2 text-sm"
            placeholder="leave blank to keep current password"
          />

          <label className="block text-xs text-gray-600">Hobbies (comma separated)</label>
          <input
            name="hobbies"
            value={form.hobbies}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1 mb-2 text-sm"
          />

          <div className="mt-3 flex justify-between">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
