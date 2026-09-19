const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value, maxLength) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "method_not_allowed" });
  }

  const name = sanitize(request.body?.name, 120);
  const phone = sanitize(request.body?.phone, 80);
  const message = sanitize(request.body?.message, 4000);
  const website = sanitize(request.body?.website, 200);

  // Honeypot: bots costumam preencher esse campo invisível.
  if (website) {
    return response.status(200).json({ ok: true });
  }

  if (!name || !message) {
    return response.status(400).json({ error: "invalid_payload" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "renandurso@aasp.org.br";
  const from = process.env.CONTACT_FROM_EMAIL || "Site Renan Durso <onboarding@resend.dev>";

  if (!apiKey) {
    return response.status(503).json({ error: "email_service_not_configured" });
  }

  const safeTo = EMAIL_PATTERN.test(to) ? to : "renandurso@aasp.org.br";

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [safeTo],
      subject: `Novo contato pelo site — ${name}`,
      text: [
        `Nome: ${name}`,
        `Telefone: ${phone || "Não informado"}`,
        "",
        "Mensagem:",
        message,
      ].join("\n"),
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    console.error("Resend contact error:", details);
    return response.status(502).json({ error: "email_delivery_failed" });
  }

  return response.status(200).json({ ok: true });
}
