import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'elitedentalweb@gmail.com',
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. The link expires in 1 hour.</p>
        <a 
          href="${resetUrl}" 
          style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;"
        >
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 0.9rem; margin-top: 24px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
};
