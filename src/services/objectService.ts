import { ObjectCollection } from '../database/models/objectDetal.js';
import { CreateObject, UpdateObject } from '../types/object.js';

export const getObjects = async () => {
  return ObjectCollection.find();
};

export const getObjectById = async (id: string) => {
  return ObjectCollection.findById(id);
};

export const createObject = async (body: CreateObject) => {
  return ObjectCollection.create(body);
};

export const updateObject = async (id: string, body: UpdateObject) => {
  return ObjectCollection.findByIdAndUpdate(id, body, { new: true });
};

export const deleteObject = async (id: string) => {
  return ObjectCollection.findByIdAndDelete(id);
};

export const updateManualProgress = async (
  id: string,
  manualProgress: number,
) => {
  return ObjectCollection.findByIdAndUpdate(
    id,
    {
      manualProgress,
      status: manualProgress >= 100 ? 'completed' : 'active',
    },
    { new: true },
  );
};
