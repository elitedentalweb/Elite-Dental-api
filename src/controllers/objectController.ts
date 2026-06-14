import { RequestHandler } from 'express';
import * as objectServices from '../services/objectService.js';
import { CreateObject, UpdateObject } from '../types/object.js';
import { UserDocument } from '../database/models/user.js';
import createHttpError from 'http-errors';

export const getObjects: RequestHandler = async (req, res, next) => {
  try {
    const objects = await objectServices.getObjects();
    res.status(200).json(objects);
  } catch (error) {
    next(error);
  }
};

export const getObjectById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const object = await objectServices.getObjectById(id);
    if (!object) return next(createHttpError(404, 'Object not found'));
    res.status(200).json(object);
  } catch (error) {
    next(error);
  }
};

export const createObject: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const body = req.body as CreateObject;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const object = await objectServices.createObject(body);
    res.status(201).json(object);
  } catch (error) {
    next(error);
  }
};

export const updateObject: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user as UserDocument;
  const body = req.body as UpdateObject;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const object = await objectServices.updateObject(id, body);
    if (!object) return next(createHttpError(404, 'Object not found'));
    res.status(200).json(object);
  } catch (error) {
    next(error);
  }
};

export const deleteObject: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user as UserDocument;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const object = await objectServices.deleteObject(id);
    if (!object) return next(createHttpError(404, 'Object not found'));
    res.status(200).json(object);
  } catch (error) {
    next(error);
  }
};

export const updateManualProgress: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user as UserDocument;
  const { manualProgress } = req.body as { manualProgress: number };
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    if (manualProgress < 0 || manualProgress > 100) {
      return next(createHttpError(400, 'Progress must be between 0 and 100'));
    }
    const object = await objectServices.updateManualProgress(
      id,
      manualProgress,
    );
    if (!object) return next(createHttpError(404, 'Object not found'));
    res.status(200).json(object);
  } catch (error) {
    next(error);
  }
};
