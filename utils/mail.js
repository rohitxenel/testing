const sendOTP = async (email, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  const url = 'https://api.brevo.com/v3/smtp/email';

  const emailData = {
    sender: {
      name: 'Your App',
      email: process.env.EMAIL_USER
    },
    to: [{
      email: email,
      name: 'User'
    }],
    subject: 'Your OTP Code',
    htmlContent: `
      <html>
        <body>
          <h2>Your OTP Code</h2>
          <p>Your one-time password is: <strong>${otp}</strong></p>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </body>
      </html>
    `,
    textContent: `Your OTP code is: ${otp}. It expires in 10 minutes.`
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error(`Brevo API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('OTP sent to', email, 'Message ID:', result.messageId);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = { sendOTP };