const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.BACKEND_URL}/api/verify-email?token=${token}`;

  const html = `
    <h2>Verify Your Salisbury Bone Database Account</h2>
    <p>Thank you for creating an account with the Salisbury Bone Database.</p>
    <p>Please click the button below to verify your email address:</p>

    <a href="${verifyUrl}" 
       target="_blank"
       style="
         display: inline-block;
         padding: 10px 18px;
         background-color: #800000;
         color: white;
         text-decoration: none;
         border-radius: 6px;
         font-weight: bold;
         margin-top: 10px;
       ">
      Verify Email
    </a>

    <br><br>
    <p>If you did not create this account, you can safely ignore this message.</p>

    <br>
    <p>Already verified? 
      <a href="${process.env.FRONTEND_URL}/login" 
         style="color: #800000; font-weight: bold;">
         Click here to log in.
      </a>
    </p>
  `;

  await transporter.sendMail({
    from: `"Salisbury Bone Database" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: "Verify Your Salisbury Bone Database Account",
    html,
  });
}
async function sendPasswordResetEmail(email, link) {
  const html = `
    <h2>Password Reset Requested</h2>
    <p>You requested to reset your Salisbury Bone Database account password.</p>
    <p>Click the button below to create a new password:</p>

    <a href="${link}" 
       target="_blank"
       style="
         display: inline-block;
         padding: 10px 18px;
         background-color: #800000;
         color: white;
         text-decoration: none;
         border-radius: 6px;
         font-weight: bold;
         margin-top: 10px;
       ">
      Reset Password
    </a>

    <br><br>
    <p>If you did not request a password reset, you can safely ignore this message.</p>
  `;

  await transporter.sendMail({
    from: `"Salisbury Bone Database" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: "Reset Your Salisbury Bone Database Password",
    html,
  });
}



module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};