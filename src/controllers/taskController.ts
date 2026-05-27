import { RequestHandler } from 'express';
import * as taskServices from '../services/taskService.js';
import { CreateTask, UpdateTask } from '../types/task.js';
import { UserDocument } from '../database/models/user.js';
import createHttpError from 'http-errors';

export const getTasks: RequestHandler = async (req, res, next) => {
  const { objectId } = req.query;
  try {
    const tasks = await taskServices.getTasks(objectId as string);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await taskServices.getTaskById(id);
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;
  const body = req.body as CreateTask;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const task = await taskServices.createTask(body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user as UserDocument;
  const body = req.body as UpdateTask;
  try {
    if (user.role !== 'admin' && user.role !== 'worker') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const task = await taskServices.updateTask(id, body);
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user as UserDocument;
  try {
    if (user.role !== 'admin') {
      return next(createHttpError(403, 'Forbidden'));
    }
    const task = await taskServices.deleteTask(id);
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const getObjectProgress: RequestHandler = async (req, res, next) => {
  const { objectId } = req.params;
  try {
    const progress = await taskServices.getObjectProgress(objectId);
    res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};
