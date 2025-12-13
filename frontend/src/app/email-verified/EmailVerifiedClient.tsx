"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerifiedClient() {
  const params = useSearchParams();
  const token = params.get("token");

  console.log("EmailVerifiedClient rendered");

  useEffect(() => {
    console.log("VERIFY URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/verify-email?token=${token}`);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email?token=${token}`);
  }, [token]);

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>Email Verified!</h1>
      <p>Your BoneDB account is now activated.</p>
      <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
        Go to Login
      </a>
    </div>
    );
}
