const emailTemplates = {
  resetPassword: (email, code) => {
    return `
    <div>
      <p>Dear ${email},</p>
      <p>You recently requested to reset your password. Please use the following token to reset your password:</p>
      <p style="font-size: 20px;"><strong>${code}</strong></p>
      <p>The token is only valid for 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br>${process.env.EMAIL_USER}</p>
    </div>
  `;
  },
};

module.exports = emailTemplates;
