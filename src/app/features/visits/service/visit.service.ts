import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Visit, VisitFormValue } from '../model/visit.model';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private firestore = inject(Firestore);

  private get col(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'visits');
  }

  watchByRestaurant(restaurantId: string, uid: string): Observable<Visit[]> {
    const q = query(
      this.col,
      where('memberIds', 'array-contains', uid),
      where('restaurantId', '==', restaurantId),
      orderBy('visitedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Visit[]>;
  }

  watchOne(id: string): Observable<Visit | undefined> {
    return docData(doc(this.firestore, `visits/${id}`), { idField: 'id' }) as Observable<
      Visit | undefined
    >;
  }

  async create(restaurantId: string, ownerId: string, input: VisitFormValue): Promise<string> {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);
    const snap = await getDoc(restaurantRef);
    if (!snap.exists()) throw new Error('Restaurant not found');
    const memberIds = (snap.data()['memberIds'] as string[]) ?? [ownerId];

    const ref = await addDoc(this.col, {
      restaurantId,
      ownerId,
      memberIds,
      visitedAt: Timestamp.fromDate(input.visitedAt),
      overall: input.overall,
      food: input.food,
      service: input.service,
      ambiance: input.ambiance,
      value: input.value,
      notes: input.notes.trim(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(restaurantRef, {
      visitCount: increment(1),
      latestRating: input.overall || null,
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  async update(id: string, input: VisitFormValue): Promise<void> {
    const ref = doc(this.firestore, `visits/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Visit not found');
    const restaurantId = snap.data()['restaurantId'] as string;

    await updateDoc(ref, {
      visitedAt: Timestamp.fromDate(input.visitedAt),
      overall: input.overall,
      food: input.food,
      service: input.service,
      ambiance: input.ambiance,
      value: input.value,
      notes: input.notes.trim(),
    });

    await updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      latestRating: input.overall || null,
      updatedAt: serverTimestamp(),
    });
  }

  async remove(id: string): Promise<void> {
    const ref = doc(this.firestore, `visits/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const restaurantId = snap.data()['restaurantId'] as string;

    await deleteDoc(ref);

    await updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      visitCount: increment(-1),
      latestRating: null,
      updatedAt: serverTimestamp(),
    });
  }
}
