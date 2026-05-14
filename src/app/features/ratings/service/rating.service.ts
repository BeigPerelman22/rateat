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
import { Rating, RatingFormValue } from '../model/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private firestore = inject(Firestore);

  private get col(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'ratings');
  }

  watchByItem(itemId: string, uid: string): Observable<Rating[]> {
    const q = query(
      this.col,
      where('memberIds', 'array-contains', uid),
      where('itemId', '==', itemId),
      orderBy('ratedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Rating[]>;
  }

  watchOne(id: string): Observable<Rating | undefined> {
    return docData(doc(this.firestore, `ratings/${id}`), { idField: 'id' }) as Observable<
      Rating | undefined
    >;
  }

  async create(
    itemId: string,
    categoryId: string,
    ownerId: string,
    input: RatingFormValue,
  ): Promise<string> {
    const itemRef = doc(this.firestore, `items/${itemId}`);
    const snap = await getDoc(itemRef);
    if (!snap.exists()) throw new Error('Item not found');
    const memberIds = (snap.data()['memberIds'] as string[]) ?? [ownerId];

    const ref = await addDoc(this.col, {
      itemId,
      categoryId,
      ownerId,
      memberIds,
      ratedAt: Timestamp.fromDate(input.ratedAt),
      parameterValues: input.parameterValues,
      overall: input.overall,
      review: input.review.trim(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(itemRef, {
      ratingCount: increment(1),
      latestRating: input.overall || null,
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  async update(id: string, input: RatingFormValue): Promise<void> {
    const ref = doc(this.firestore, `ratings/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Rating not found');
    const itemId = snap.data()['itemId'] as string;

    await updateDoc(ref, {
      ratedAt: Timestamp.fromDate(input.ratedAt),
      parameterValues: input.parameterValues,
      overall: input.overall,
      review: input.review.trim(),
    });

    await updateDoc(doc(this.firestore, `items/${itemId}`), {
      latestRating: input.overall || null,
      updatedAt: serverTimestamp(),
    });
  }

  async remove(id: string): Promise<void> {
    const ref = doc(this.firestore, `ratings/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const itemId = snap.data()['itemId'] as string;

    await deleteDoc(ref);

    await updateDoc(doc(this.firestore, `items/${itemId}`), {
      ratingCount: increment(-1),
      latestRating: null,
      updatedAt: serverTimestamp(),
    });
  }
}
