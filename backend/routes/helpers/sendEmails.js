const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("USING RESEND EMAIL HELPER");

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/email-verified?token=${token}`;

  try {
    await resend.emails.send({
      from: "Salisbury Bone Database <bonemaster@su-bones.com>",
      to: email,
      subject: "Verify your Salisbury Bone Database account",
      html: `
        <h2>Verify Your Email</h2>
        <p>Thanks for registering.</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <br /><br />
        <p>If you did not create this account, please ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Resend verification email failed:", err);
    throw err;
  }
}

async function sendPasswordResetEmail(email, link) {
  try {
    await resend.emails.send({
      from: "Salisbury Bone Database <bonemaster@su-bones.com>",
      to: email,
      subject: "Reset Your Salisbury Bone Database Password",
      html: `
        <h2>Password Reset Requested</h2>
        <p>Click below to set a new password:</p>
        <a href="${link}">Reset Password</a>
        <br /><br />
        <p>If you did not request this reset, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Resend password reset email failed:", err);
    throw err;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
