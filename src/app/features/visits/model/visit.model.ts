import { Timestamp } from '@angular/fire/firestore';

export interface Visit {
  id: string;
  restaurantId: string;
  ownerId: string;
  memberIds: string[];
  visitedAt: Timestamp | null;
  overall: number;
  food: number;
  service: number;
  ambiance: number;
  value: number;
  notes: string;
  createdAt: Timestamp | null;
}

export interface VisitFormValue {
  visitedAt: Date;
  overall: number;
  food: number;
  service: number;
  ambiance: number;
  value: number;
  notes: string;
}
