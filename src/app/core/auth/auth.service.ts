import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  authState,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, switchMap, of } from 'rxjs';
import { AppUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  readonly firebaseUser$: Observable<User | null> = authState(this.auth);

  readonly appUser$: Observable<AppUser | null> = this.firebaseUser$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      return docData(doc(this.firestore, `users/${user.uid}`)) as Observable<AppUser | null>;
    }),
  );

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);
    await this.ensureUserDoc(cred.user);
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  private async ensureUserDoc(user: User): Promise<void> {
    const ref = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(ref);
    if (snap.exists()) return;
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? user.email ?? 'Unknown',
      photoURL: user.photoURL ?? null,
      partners: [],
      createdAt: serverTimestamp(),
    });
  }
}
