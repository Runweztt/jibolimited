// sendMail.js
export async function sendMail({ to, subject, html }) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY; // your Resend API key
  const from = "Jibo Rides <onboarding@resend.dev>"; // use your verified sender email here

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend API Error:", error);
      throw new Error("Failed to send email");
    }

    return await response.json();
  } catch (err) {
    console.error("SendMail error:", err);
    throw err;
  }
}
