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
  getDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Item, ItemFormValue } from '../model/item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private firestore = inject(Firestore);

  private get col(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'items');
  }

  watchByCategory(categoryId: string, uid: string): Observable<Item[]> {
    const q = query(
      this.col,
      where('memberIds', 'array-contains', uid),
      where('categoryId', '==', categoryId),
      orderBy('updatedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Item[]>;
  }

  watchOne(id: string): Observable<Item | undefined> {
    return docData(doc(this.firestore, `items/${id}`), { idField: 'id' }) as Observable<
      Item | undefined
    >;
  }

  async create(categoryId: string, ownerId: string, input: ItemFormValue): Promise<string> {
    const categoryRef = doc(this.firestore, `categories/${categoryId}`);
    const snap = await getDoc(categoryRef);
    if (!snap.exists()) throw new Error('Category not found');
    const memberIds = (snap.data()['memberIds'] as string[]) ?? [ownerId];

    const ref = await addDoc(this.col, {
      categoryId,
      ownerId,
      memberIds,
      name: input.name.trim(),
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      latestRating: null,
      ratingCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(categoryRef, {
      itemCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return ref.id;
  }

  async update(id: string, ownerId: string, input: ItemFormValue): Promise<void> {
    const sharedWith = [...new Set(input.sharedWith)];
    await updateDoc(doc(this.firestore, `items/${id}`), {
      name: input.name.trim(),
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      sharedWith,
      memberIds: [ownerId, ...sharedWith],
      updatedAt: serverTimestamp(),
    });
  }

  async remove(id: string): Promise<void> {
    const itemRef = doc(this.firestore, `items/${id}`);
    const snap = await getDoc(itemRef);
    if (!snap.exists()) return;
    const categoryId = snap.data()['categoryId'] as string;

    await deleteDoc(itemRef);

    await updateDoc(doc(this.firestore, `categories/${categoryId}`), {
      itemCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }
}
