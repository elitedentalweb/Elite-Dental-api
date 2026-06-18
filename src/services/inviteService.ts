import crypto from 'crypto';
import { InviteCollection } from '../database/models/invite.js';
import { sendEmail } from './emailService.js';

export const createInvite = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

  await InviteCollection.create({
    email: normalizedEmail,
    token,
    expiresAt,
  });

  const inviteLink = `${process.env.CLIENT_URL}/auth/register?invite=${token}`;

  await sendEmail(
    normalizedEmail,
    "You've been invited!",
    `<p>You have been invited to join the platform.</p>
     <p>Click the link below to register:</p>
     <a href="${inviteLink}">${inviteLink}</a>
     <p>This invitation expires in 7 days.</p>`,
  );

  return { message: 'Invite sent successfully' };
};

export const getInviteByToken = async (token: string) => {
  return InviteCollection.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });
};

export const markInviteAsUsed = async (token: string) => {
  return InviteCollection.findOneAndUpdate({ token }, { used: true });
};
