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
import { Category, CategoryFormValue } from '../model/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private firestore = inject(Firestore);

  private get col(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'categories');
  }

  watchForUser(uid: string): Observable<Category[]> {
    const q = query(this.col, where('memberIds', 'array-contains', uid), orderBy('updatedAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  watchOne(id: string): Observable<Category | undefined> {
    return docData(doc(this.firestore, `categories/${id}`), { idField: 'id' }) as Observable<Category | undefined>;
  }

  create(ownerId: string, input: CategoryFormValue) {
    const sharedWith = [...new Set(input.sharedWith)];
    return addDoc(this.col, {
      ownerId,
      sharedWith,
      memberIds: [ownerId, ...sharedWith],
      name: input.name.trim(),
      parameters: input.parameters,
      allowMultipleRatings: input.allowMultipleRatings,
      itemCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  update(id: string, ownerId: string, input: CategoryFormValue) {
    const sharedWith = [...new Set(input.sharedWith)];
    return updateDoc(doc(this.firestore, `categories/${id}`), {
      name: input.name.trim(),
      parameters: input.parameters,
      allowMultipleRatings: input.allowMultipleRatings,
      sharedWith,
      memberIds: [ownerId, ...sharedWith],
      updatedAt: serverTimestamp(),
    });
  }

  remove(id: string) {
    return deleteDoc(doc(this.firestore, `categories/${id}`));
  }
}
