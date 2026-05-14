import { Timestamp } from '@angular/fire/firestore';

export interface RatingParameter {
  id: string;
  label: string;
  scale: number;
}

export interface Category {
  id: string;
  ownerId: string;
  sharedWith: string[];
  memberIds: string[];
  name: string;
  parameters: RatingParameter[];
  allowMultipleRatings: boolean;
  itemCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type CategoryFormValue = {
  name: string;
  parameters: RatingParameter[];
  allowMultipleRatings: boolean;
  sharedWith: string[];
};
