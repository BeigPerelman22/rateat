import { Timestamp } from '@angular/fire/firestore';

export interface RatingParameter {
  id: string;
  label: string;
  scale: number;
}

export type RatingMethod = '5star' | '10point';

export interface Category {
  id: string;
  ownerId: string;
  sharedWith: string[];
  memberIds: string[];
  name: string;
  parameters: RatingParameter[];
  allowMultipleRatings: boolean;
  ratingMethod: RatingMethod;
  itemCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type CategoryFormValue = {
  name: string;
  parameters: RatingParameter[];
  allowMultipleRatings: boolean;
  ratingMethod: RatingMethod;
  sharedWith: string[];
};
