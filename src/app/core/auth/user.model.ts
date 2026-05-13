import { Timestamp } from '@angular/fire/firestore';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  partners: PartnerRef[];
  createdAt: Timestamp | null;
}

export interface PartnerRef {
  uid: string;
  email: string;
  displayName: string;
}

export type NewAppUser = Omit<AppUser, 'createdAt'>;
