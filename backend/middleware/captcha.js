async function captchaHandler(req, res, next) {
  console.log("Received CAPTCHA token:", req.body.captchaToken);

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const token = req.body.captchaToken;

  if (!token) {
    return res.status(400).json({ message: "Missing CAPTCHA token" });
  }

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

  const params = new URLSearchParams();
  params.append("secret", secretKey);
  params.append("response", token);

  try {
    const captchaResponse = await fetch(verifyUrl, {
      method: "POST",
      body: params
    });

    const captchaData = await captchaResponse.json();

    console.log("Google response:", captchaData);

    if (!captchaData.success) {
      return res.status(400).json({
        message: "CAPTCHA verification failed",
        details: captchaData["error-codes"]
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "CAPTCHA validation failed" });
  }
}

module.exports = { captchaHandler };
