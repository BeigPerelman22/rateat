import { Timestamp } from '@angular/fire/firestore';

export interface Rating {
  id: string;
  itemId: string;
  categoryId: string;
  ownerId: string;
  memberIds: string[];
  ratedAt: Timestamp | null;
  parameterValues: Record<string, number>;
  overall: number;
  review: string;
  createdAt: Timestamp | null;
}

export type RatingFormValue = {
  ratedAt: Date;
  parameterValues: Record<string, number>;
  overall: number;
  review: string;
};
