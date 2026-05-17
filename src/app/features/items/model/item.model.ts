import { Timestamp } from '@angular/fire/firestore';

export interface Item {
  id: string;
  categoryId: string;
  ownerId: string;
  sharedWith: string[];
  memberIds: string[];
  name: string;
  tags: string[];
  latestRating: number | null;
  ratingCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ItemFormValue = {
  name: string;
  tags: string[];
  sharedWith: string[];
};
