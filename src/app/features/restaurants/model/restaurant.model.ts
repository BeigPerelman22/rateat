import { Timestamp } from '@angular/fire/firestore';

export interface Restaurant {
  id: string;
  ownerId: string;
  sharedWith: string[];
  memberIds: string[];
  name: string;
  cuisine: string;
  address: string;
  tags: string[];
  latestRating: number | null;
  visitCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type RestaurantFormValue = {
  name: string;
  cuisine: string;
  address: string;
  tags: string[];
  sharedWith: string[];
};
