// types.ts
export interface Project {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  status?: string;
  manufacturerId?: {
    _id: string;
    name: string;
  };
}

export interface Note {
  _id: string;
  fileUrl: string;
  extractedText: string;
  createdAt: string;
}
