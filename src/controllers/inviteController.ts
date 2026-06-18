import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserDocument } from '../database/models/user.js';
import * as inviteService from '../services/inviteService.js';

export const createInviteController: RequestHandler = async (
  req,
  res,
  next,
) => {
  const user = req.user as UserDocument;
  const { email } = req.body as { email: string };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    if (!email) {
      return next(createHttpError(400, 'Email is required'));
    }
    const result = await inviteService.createInvite(email);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
