import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Partner } from '../model/partner.model';

@Injectable({ providedIn: 'root' })
export class PartnerService {
  private firestore = inject(Firestore);

  async findUserByEmail(email: string): Promise<Partner | null> {
    const q = query(collection(this.firestore, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data() as {
      uid: string;
      email: string;
      displayName: string;
    };
    return { uid: data.uid, email: data.email, displayName: data.displayName };
  }

  async linkPartner(me: Partner, other: Partner): Promise<void> {
    const myRef = doc(this.firestore, `users/${me.uid}`);
    const otherRef = doc(this.firestore, `users/${other.uid}`);
    await Promise.all([
      updateDoc(myRef, { partners: arrayUnion(other) }),
      updateDoc(otherRef, { partners: arrayUnion(me) }),
    ]);
  }

  async unlinkPartner(me: Partner, other: Partner): Promise<void> {
    const myRef = doc(this.firestore, `users/${me.uid}`);
    const otherRef = doc(this.firestore, `users/${other.uid}`);
    await Promise.all([
      updateDoc(myRef, { partners: arrayRemove(other) }),
      updateDoc(otherRef, { partners: arrayRemove(me) }),
    ]);
  }
}
