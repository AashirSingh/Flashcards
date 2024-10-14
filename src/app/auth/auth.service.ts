import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { ConfigService } from '../config.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User | null>(null);
  private activeLogoutTimer: any;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private configService: ConfigService
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

  get role() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.role : 'user'))
    );
  }

  autoLogin() {
    const storedData = localStorage.getItem('authData');
    if (!storedData) return of(false);

    const parsedData = JSON.parse(storedData) as {
      token: string;
      tokenExpirationDate: string;
      userId: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };

    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) return of(false);

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
    this.configService.updateStreak(user.id);

    return of(true);
  }

  signup(email: string, password: string, firstName: string, lastName: string, role: string = 'user') {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebase.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        switchMap((resData: AuthResponseData) => {
          // Check if resData.expiresIn is defined and valid
          const expiresIn = +resData.expiresIn || 3600; // Default to 1 hour if undefined
          const expirationTime = new Date(new Date().getTime() + expiresIn * 1000);
  
          const user = new User(
            resData.localId,
            firstName,
            lastName,
            resData.email,
            resData.idToken,
            expirationTime,
            role
          );
          this._user.next(user);
  
          // Write user data into the Realtime Database
          return this.token.pipe(
            take(1),
            switchMap(token => {
              const accountData = {
                email,
                firstName,
                lastName,
                role,
                userId: resData.localId
              };
  
              return this.http.put<any>(
                `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts/${resData.localId}.json?auth=${token}`,
                accountData
              );
            })
          );
        }),
        // After signup, store data in localStorage
        tap((resData) => {
          const expiresIn = +resData.expiresIn || 3600; // Ensure default expiration
          this.storeAuthData(
            resData.localId,
            resData.idToken,
            new Date(new Date().getTime() + expiresIn * 1000).toISOString(),
            email,
            firstName,
            lastName,
            role
          );
        })
      );
  }
  

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebase.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          // Ensure expiresIn is valid, default to 1 hour if it's undefined
          const expiresIn = +userData.expiresIn || 3600;
          const expirationTime = new Date(new Date().getTime() + expiresIn * 1000);
  
          const user = new User(
            userData.localId,
            'FirstName', // Replace with proper logic if needed
            'LastName',  // Replace with proper logic if needed
            userData.email,
            userData.idToken,
            expirationTime,
            'user' // Default role
          );
  
          this._user.next(user);
          this.storeAuthData(
            userData.localId,
            userData.idToken,
            expirationTime.toISOString(),
            userData.email,
            'FirstName',
            'LastName',
            'user'
          );
          this.autoLogout(user.tokenDuration);
          this.configService.updateStreak(userData.localId);
        })
      );
  }

  private saveUserToDatabase(userId: string, email: string, firstName: string, lastName: string) {
    const userData = {
      email,
      firstName,
      lastName,
      userId,
    };
    this.http
      .put(
        `https://bookings-2bd51-default-rtdb.firebaseio.com/${userId}.json`,
        userData
      )
      .subscribe(() => {
        console.log('User saved to Realtime Database');
      });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap(async (result) => {
        if (!result.user) {
          throw new Error('User not found');
        }

        const token = await result.user.getIdToken();
        const tokenResult = await result.user.getIdTokenResult();
        const role = tokenResult.claims['role'] || 'user';  
        const expirationTime = new Date(new Date().getTime() + 3600 * 1000);

        const displayName = result.user.displayName || '';
        const [firstName, lastName] = displayName.split(' ');  

        const user = new User(
          result.user.uid!,
          firstName || 'FirstName',  
          lastName || 'LastName',    
          result.user.email!,
          token,
          expirationTime,
          role
        );
        this._user.next(user);
        this.storeAuthData(
          user.id, 
          token, 
          expirationTime.toISOString(), 
          user.email!, 
          role, 
          firstName, 
          lastName
        );
        this.autoLogout(user.tokenDuration);
        this.configService.updateStreak(user.id);
        return user;
      })
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    localStorage.removeItem('authData');
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const role = 'user'; 
    const user = new User(
      userData.localId,
      'FirstName',  
      'LastName',   
      userData.email,
      userData.idToken,
      expirationTime,
      role
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email,
      role,
      'FirstName',  
      'LastName'    
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    role: string,
    firstName: string,
    lastName: string
  ) {
    const data = JSON.stringify({ userId, token, tokenExpirationDate, email, role, firstName, lastName });
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