import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from './emailService.js';

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  ONE_DAY,
  ONE_MONTH,
} from '../helpers/constants.js';
import { UserCollection, type UserDocument } from '../database/models/user.js';
import {
  createUser,
  findUserByEmail,
  getUserByEmail,
  getUserById,
} from './userService.js';
import {
  createSession,
  deleteSessionByToken,
  getSessionByToken,
  rotateSession,
} from './sessionService.js';

type RegisterPayload = {
  email: string;
  password: string;
  nickname?: string;
  adminCode?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type SessionMeta = {
  userAgent?: string;
  ip?: string;
};

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_VALIDITY = ONE_MONTH;

const createAccessToken = (user: UserDocument) => {
  const options: jwt.SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET as jwt.Secret,
    options,
  );
};

const createRefreshToken = () => crypto.randomBytes(64).toString('hex');

const createSessionForUser = async (
  user: UserDocument,
  meta: SessionMeta,
  refreshTokenValidity = ONE_MONTH,
): Promise<AuthTokens> => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + refreshTokenValidity);

  await createSession({
    userId: user._id.toString(),
    refreshToken,
    expiresAt,
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return { accessToken, refreshToken };
};

export const registerUserService = async ({
  email,
  password,
  nickname,
  adminCode,
}: RegisterPayload) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createHttpError(409, 'Email already registered');
  }

  if (adminCode && adminCode !== process.env.ADMIN_SECRET) {
    throw createHttpError(400, 'Invalid admin code');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const isAdmin = adminCode === process.env.ADMIN_SECRET;
  const role = isAdmin ? 'admin' : 'user';
  const isApproved = isAdmin;

  await createUser({
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isApproved,
    nickname: nickname?.trim() || normalizedEmail,
  });

  return { message: 'User successfully registered' };
};

export const loginService = async (
  { email, password, rememberMe = false }: LoginPayload,
  meta: SessionMeta,
): Promise<AuthTokens> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUserByEmail(normalizedEmail);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const refreshTokenValidity = rememberMe ? ONE_MONTH : ONE_DAY;

  return createSessionForUser(user, meta, refreshTokenValidity);
};

export const refreshService = async (
  refreshToken: string,
  meta: SessionMeta,
): Promise<AuthTokens> => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  const session = await getSessionByToken(refreshToken);

  if (!session) {
    throw createHttpError(401, 'Refresh token invalid');
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSessionByToken(refreshToken);
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await getUserById(session.userId.toString());
  const newRefreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_VALIDITY);

  await rotateSession(session._id.toString(), newRefreshToken, expiresAt, meta);

  return {
    accessToken: createAccessToken(user),
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async (refreshToken?: string) => {
  if (!refreshToken) return;
  await deleteSessionByToken(refreshToken);
};

export const forgotPasswordService = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);

  if (!user)
    return { message: 'If this email exists, you will receive a reset link' };

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await UserCollection.findByIdAndUpdate(user._id, {
    resetToken,
    resetTokenExpiry,
  });

  await sendPasswordResetEmail(normalizedEmail, resetToken);

  return { message: 'If this email exists, you will receive a reset link' };
};

export const resetPasswordService = async (
  token: string,
  newPassword: string,
) => {
  const user = await UserCollection.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw createHttpError(400, 'Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await UserCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null,
  });

  return { message: 'Password successfully reset' };
};
