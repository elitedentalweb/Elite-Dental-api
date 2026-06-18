import { ObjectCollection } from '../database/models/objectDetal.js';
import { TaskCollection } from '../database/models/task.js';
import { CreateTask, UpdateTask } from '../types/task.js';

export const getTasks = async (objectId?: string) => {
  const query = objectId ? { objectId } : {};
  return TaskCollection.find(query);
};

export const getTaskById = async (id: string) => {
  return TaskCollection.findById(id);
};

export const createTask = async (body: CreateTask) => {
  return TaskCollection.create(body);
};

export const updateTask = async (id: string, body: UpdateTask) => {
  const task = await TaskCollection.findById(id);
  if (!task) return null;

  if (body.current !== undefined) task.current = body.current;
  if (body.total !== undefined) task.total = body.total;
  if (body.title !== undefined) task.title = body.title;
  if (body.description !== undefined) task.description = body.description;
  if (body.photos !== undefined) task.photos = body.photos;

  const saved = await task.save();

  const allTasks = await TaskCollection.find({ objectId: task.objectId });
  const allCompleted = allTasks.every(t => t.current >= t.total && t.total > 0);

  await ObjectCollection.findByIdAndUpdate(task.objectId, {
    status: allCompleted ? 'completed' : 'active',
  });

  return saved;
};
export const deleteTask = async (id: string) => {
  return TaskCollection.findByIdAndDelete(id);
};

export const getObjectProgress = async (objectId: string) => {
  const tasks = await TaskCollection.find({ objectId });
  const object = await ObjectCollection.findById(objectId);
  const manualProgress = object?.manualProgress ?? 0;

  if (!tasks.length) return manualProgress;

  const autoProgress = Math.round(
    tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length,
  );

  return Math.max(autoProgress, manualProgress);
};
