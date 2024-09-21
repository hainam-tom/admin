

// Your Mailjet API keys
const mailjetAPIKey = '5294d108fdbf307ffecd9b07ec9d85f0';
const mailjetSecretKey = 'fb1524c83ba1dd6f5af86fe27cfe9e40';

// Base64-encoded authentication token
const authToken = btoa(`${mailjetAPIKey}:${mailjetSecretKey}`);

// Dynamic sendEmail function
const sendEmail = async ({ fromEmail, fromName, toEmail, toName, subject, textContent, htmlContent }) => {
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "Messages": [
        {
          "From": {
            "Email": fromEmail,
            "Name": fromName
          },
          "To": [
            {
              "Email": toEmail,
              "Name": toName
            }
          ],
          "Subject": subject,
          "TextPart": textContent,
          "HTMLPart": htmlContent
        }
      ]
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Email sent successfully:", data);
} else {
    const errorData = await response.json(); // Get response body for error details
    console.error("Failed to send email:", response.statusText, errorData);
}
};

// Example usage:
/* sendEmail({
  fromEmail: "your-email@example.com",
  fromName: "Your Name",
  toEmail: "recipient@example.com",
  toName: "Recipient Name",
  subject: "Your email subject",
  textContent: "Email body as plain text",
  htmlContent: "<h3>Email body as HTML</h3>"
}); */
