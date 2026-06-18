import {
  UserCollection,
  type User,
  type UserDocument,
} from '../database/models/user.js';
import { sendEmail } from './emailService.js';

export type CreateUserInput = Pick<
  User,
  'email' | 'password' | 'nickname' | 'role' | 'isApproved'
>;

export const createUser = (userData: CreateUserInput) => {
  return UserCollection.create(userData);
};

export const findUserByEmail = (email: string) => {
  return UserCollection.findOne({ email });
};

export const getUserByEmail = async (email: string): Promise<UserDocument> => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const getUserById = async (id: string): Promise<UserDocument> => {
  const user = await UserCollection.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const getUsers = async () => {
  return UserCollection.find();
};

export const deleteUser = async (email: string) => {
  const user = await UserCollection.findOneAndDelete({ email });
  if (!user) throw new Error('User not found');

  await sendEmail(
    user.email,
    'Account Deleted',
    `<p>Hello ${user.nickname},</p>
     <p>Your account has been deleted by the administrator.</p>`,
  );

  return user;
};

export const approveUser = async (email: string) => {
  const user = await UserCollection.findOneAndUpdate(
    { email },
    { isApproved: true },
    { new: true },
  );

  if (!user) {
    throw new Error('User not found');
  }

  await sendEmail(
    user.email,
    'Account Approved',
    `<p>Hello ${user.nickname},</p>
     <p>Your account has been approved! You can now log in.</p>
     <a href="${process.env.CLIENT_URL}/auth/login">Log in</a>`,
  );

  return user;
};

export const revokeUser = async (email: string) => {
  const user = await UserCollection.findOneAndUpdate(
    { email },
    { isApproved: false },
    { new: true },
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const setUserRole = async (
  email: string,
  role: 'user' | 'worker' | 'admin',
) => {
  const user = await UserCollection.findOneAndUpdate(
    { email },
    { role },
    { new: true },
  );

  if (!user) {
    throw new Error('User not found');
  }

  await sendEmail(
    user.email,
    'Role Changed',
    `<p>Hello ${user.nickname},</p>
     <p>Your role has been changed to: <strong>${role}</strong></p>`,
  );

  return user;
};
