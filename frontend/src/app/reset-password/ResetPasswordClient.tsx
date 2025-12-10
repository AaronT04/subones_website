"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ResetPasswordClient() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function reset() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/login";
    } else {
      setMessage(data.error);
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold">Choose a New Password</h1>

      <input
        type="password"
        placeholder="New password"
        className="w-full border rounded-lg p-3 mt-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="mt-4 w-full bg-maroon text-white p-3 rounded-lg hover:opacity-90"
        onClick={reset}
      >
        Reset Password
      </button>

      {message && (
        <p className="mt-4 text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
