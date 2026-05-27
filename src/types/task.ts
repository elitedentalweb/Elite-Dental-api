export interface CreateTask {
  objectId: string;
  title: string;
  description?: string;
  photos?: string[];
  total: number;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  photos?: string[];
  total?: number;
  current?: number;
}

export interface TaskResponse {
  _id: string;
  objectId: string;
  title: string;
  description: string;
  photos: string[];
  total: number;
  current: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}
