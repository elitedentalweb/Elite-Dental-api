export interface CreateObject {
  title: string;
  client: string;
  location: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status?: 'active' | 'completed';
  photosBefore?: string[];
  photosAfter?: string[];
}

export interface UpdateObject {
  title?: string;
  client?: string;
  location?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'completed';
  photosBefore?: string[];
  photosAfter?: string[];
}

export interface ObjectResponse {
  _id: string;
  title: string;
  client: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed';
  photosBefore: string[];
  photosAfter: string[];
  createdAt: Date;
  updatedAt: Date;
}
