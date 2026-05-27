import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserCollection, UserDocument } from '../database/models/user.js';
import * as userService from '../services/userService.js';
import { deleteUser } from '../services/userService.js';

export const getUsersController: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const approveUserController: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const { email } = req.body as { email: string };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const updatedUser = await userService.approveUser(email);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const setRoleController: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const { email, role } = req.body as {
    email: string;
    role: 'user' | 'worker' | 'admin';
  };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const updated = await UserCollection.findOneAndUpdate(
      { email },
      { role },
      { new: true },
    );
    if (!updated) return next(createHttpError(404, 'User not found'));
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const revokeUserController: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const { email } = req.body as { email: string };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const updatedUser = await userService.revokeUser(email);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUserController: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const { email } = req.body as { email: string };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const deleted = await deleteUser(email);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
