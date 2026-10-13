export interface Book {
  id: string;
  title: string;
  publicationYear: number;
  publicationDate: Date;
  genre: string;
  available: boolean;
  publisher: string;
  pageCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorIds: string[];
}

export interface BookInput {
  title: string;
  publicationYear?: number;
  publicationDate?: Date;
  genre?: string;
  available: boolean;
  publisher: string;
  pageCount?: number;
  authorIds: string[];
}

export interface BookUpdateInput {
  title?: string;
  publicationYear?: number;
  publicationDate?: Date;
  genre?: string;
  publisher?: string;
  pageCount?: number;
  authorIds?: string[];
}
