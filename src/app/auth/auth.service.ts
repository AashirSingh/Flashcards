import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, of, Observable } from 'rxjs';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './user.model';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User | null>(null);
  private activeLogoutTimer: any;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => (user ? !!user.token : false))
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.id : null))
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.token : null))
    );
  }

  get user() {
    return this._user.asObservable();
  }

  signup(email: string, password: string, firstName: string, lastName: string): Observable<User> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap(userCredential => {
        if (!userCredential.user) {
          throw new Error('User registration failed');
        }

        const userId = userCredential.user.uid;

        // Save additional user data to Firestore
        const userData = {
          firstName,
          lastName,
          email,
          userId,
          role: 'user', // Default role for new users
        };

        return from(this.firestore.collection('users').doc(userId).set(userData)).pipe(
          switchMap(() => from(userCredential.user!.getIdToken())),
          map(token => {
            if (!token) {
              throw new Error('Token retrieval failed');
            }
            const expirationTime = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

            const newUser = new User(
              userId,
              firstName,
              lastName,
              email,
              token,
              expirationTime,
              'user'
            );

            this._user.next(newUser);
            this.storeAuthData(
              userId,
              token,
              expirationTime.toISOString(),
              email,
              firstName,
              lastName,
              'user'
            );

            return newUser;
          })
        );
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(userCredential => {
        if (!userCredential.user) {
          throw new Error('Login failed');
        }

        const userId = userCredential.user.uid;
        return from(userCredential.user.getIdToken()).pipe(
          switchMap(token => {
            if (!token) {
              throw new Error('Token retrieval failed');
            }
            const expirationTime = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

            return this.firestore.collection('users').doc(userId).get().pipe(
              map(docSnapshot => {
                if (docSnapshot.exists) {
                  const userData = docSnapshot.data() as any;
                  const user = new User(
                    userId,
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    token,
                    expirationTime,
                    userData.role || 'user'
                  );

                  this._user.next(user);
                  this.storeAuthData(
                    userId,
                    token,
                    expirationTime.toISOString(),
                    userData.email,
                    userData.firstName,
                    userData.lastName,
                    userData.role || 'user'
                  );

                  return user;
                } else {
                  throw new Error('User data not found in Firestore');
                }
              })
            );
          })
        );
      })
    );
  }

  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap(result => {
        const user = result.user;
        if (!user) {
          throw new Error('User not found');
        }

        const userId = user.uid;

        return from(user.getIdToken()).pipe(
          switchMap(token => {
            if (!token) {
              throw new Error('Token retrieval failed');
            }
            const expirationTime = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiration

            const displayName = user.displayName || '';
            const [firstName, lastName] = displayName.split(' ') || ['FirstName', 'LastName'];

            const userData = {
              email: user.email!,
              firstName,
              lastName,
              userId,
              role: 'user' // Default role for Google sign-ins
            };

            // Save user data to Firestore
            return from(this.firestore.collection('users').doc(userId).set(userData)).pipe(
              map(() => {
                const newUser = new User(
                  userId,
                  firstName,
                  lastName,
                  user.email!,
                  token,
                  expirationTime,
                  'user'
                );

                this._user.next(newUser);
                this.storeAuthData(
                  newUser.id,
                  token,
                  expirationTime.toISOString(),
                  newUser.email!,
                  firstName,
                  lastName,
                  'user'
                );

                return newUser;
              })
            );
          })
        );
      })
    );
  }

  autoLogin(): Observable<boolean> {
    const storedData = localStorage.getItem('authData');
    if (!storedData) {
      return of(false);
    }

    const parsedData = JSON.parse(storedData) as {
      userId: string;
      token: string;
      tokenExpirationDate: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };

    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) {
      return of(false);
    }

    const user = new User(
      parsedData.userId,
      parsedData.firstName,
      parsedData.lastName,
      parsedData.email,
      parsedData.token,
      expirationTime,
      parsedData.role
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    return of(true);
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    localStorage.removeItem('authData');
    this.afAuth.signOut();
  }

  updateAccountDetails(userId: string, firstName: string, lastName: string, email: string): Observable<void> {
    // Step 1: Update Firestore with new details
    const firestoreUpdate$ = from(this.firestore.collection('users').doc(userId).update({
      firstName: firstName,
      lastName: lastName,
      email: email
    }));
  
    // Step 2: Update Firebase Authentication email if it has changed
    const authUpdate$ = from(this.afAuth.currentUser).pipe(
      switchMap((user) => {
        if (user && user.email !== email) {
          return from(user.updateEmail(email)); // Firebase Authentication method to update email
        } else {
          return of(null); // No need to update if the email hasn't changed
        }
      }),
      map(() => {
        return; // Convert `null` to `void` so the type matches
      })
    );
  
    // Execute both updates and refresh local user state
    return firestoreUpdate$.pipe(
      switchMap(() => authUpdate$),
      tap(() => {
        // Refresh the local user state
        this._user.pipe(take(1)).subscribe(user => {
          if (user) {
            const updatedUser = new User(
              user.id,
              firstName,
              lastName,
              email,
              user.token!,
              user.tokenExpirationDate,
              user.role
            );
            this._user.next(updatedUser);
            // Update local storage to persist the changes
            this.storeAuthData(user.id, user.token!, user.tokenExpirationDate.toISOString(), email, firstName, lastName, user.role);
          }
        });
      })
    );
  }  
  
  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email,
      firstName,
      lastName,
      role,
    });
    localStorage.setItem('authData', data);
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}