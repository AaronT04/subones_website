"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submitRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold">Reset Your Password</h1>
      <p className="mt-2 text-gray-600">Enter your email and we will send a reset link.</p>

      <input 
        type="email"
        placeholder="Enter your email"
        className="w-full border rounded-lg p-3 mt-4"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="mt-4 w-full bg-maroon text-white p-3 rounded-lg hover:opacity-90"
        onClick={submitRequest}
      >
        Send Reset Link
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
