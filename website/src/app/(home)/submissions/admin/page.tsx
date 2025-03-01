"use client";

import { useState } from "react";
import AdminSubmissionsPage from "./AdminSubmissionsPage"; // Adjust the import path as needed

const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch('/api/admin/checkpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }});
  };

  if (isAuthenticated) {
    return <AdminSubmissionsPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handlePasswordSubmit} className="p-4 border rounded">
        <h1 className="text-2xl font-bold mb-4">Enter Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded mb-4"
          placeholder="Password"
        />
        <button type="submit" className="p-2 border rounded bg-blue-500 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminPage;