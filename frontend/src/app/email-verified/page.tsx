export default function EmailVerified() {
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
