import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Restaurant, RestaurantFormValue } from '../model/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private firestore = inject(Firestore);

  private get col(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'restaurants');
  }

  watchForUser(uid: string): Observable<Restaurant[]> {
    const q = query(
      this.col,
      where('memberIds', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Restaurant[]>;
  }

  watchOne(id: string): Observable<Restaurant | undefined> {
    return docData(doc(this.firestore, `restaurants/${id}`), { idField: 'id' }) as Observable<
      Restaurant | undefined
    >;
  }

  create(ownerId: string, input: RestaurantFormValue) {
    const sharedWith = [...new Set(input.sharedWith)];
    return addDoc(this.col, {
      ownerId,
      sharedWith,
      memberIds: [ownerId, ...sharedWith],
      name: input.name.trim(),
      cuisine: input.cuisine.trim(),
      address: input.address.trim(),
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      latestRating: null,
      visitCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  update(id: string, ownerId: string, input: RestaurantFormValue) {
    const sharedWith = [...new Set(input.sharedWith)];
    return updateDoc(doc(this.firestore, `restaurants/${id}`), {
      sharedWith,
      memberIds: [ownerId, ...sharedWith],
      name: input.name.trim(),
      cuisine: input.cuisine.trim(),
      address: input.address.trim(),
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    });
  }

  remove(id: string) {
    return deleteDoc(doc(this.firestore, `restaurants/${id}`));
  }
}
