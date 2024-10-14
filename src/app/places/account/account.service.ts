import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { Account } from './account.model';
import { AuthService } from '../../auth/auth.service';

interface AccountData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  items: any[];
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = new BehaviorSubject<Account[]>([]);

  get account() {
    return this._accounts.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchAccount() {
    return this.authService.userId.pipe(
      switchMap(userId => {
        return this.http.get<{ [key: string]: AccountData }>(
          `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map(accountData => {
        const accounts: Account[] = [];
        for (const key in accountData) {
          if (accountData.hasOwnProperty(key)) {
            const itemsArray = Array.isArray(accountData[key].items) ? accountData[key].items : [];
            const role = accountData[key].role || 'user'; // Default to 'user' if role is missing
  
            accounts.push(
              new Account(
                key,
                accountData[key].userId,
                accountData[key].firstName,
                accountData[key].lastName,
                accountData[key].email,
                itemsArray,
                role
              )
            );
          }
        }
        return accounts;
      }),
      tap(accounts => {
        this._accounts.next(accounts);
      })
    );
  }
  

  updateAccountDetails(userId: string, firstName: string, lastName: string, email: string, role: string = 'user') {
    const updateData = {
      firstName,
      lastName,
      email,
      role
    };

    return this.http.patch<{ name: string }>(
      `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts/${userId}.json`,
      updateData
    ).pipe(
      tap(() => {
        this.fetchAccount(); // Refresh the local state to reflect updated details
      })
    );
  }

  // Adds user and admin role fields for existing accounts in Firebase
  updateRoleForExistingAccounts() {
    this.http.get<{ [key: string]: AccountData }>(
      `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts.json`
    ).pipe(
      map(accountData => {
        for (const key in accountData) {
          if (accountData.hasOwnProperty(key) && !accountData[key].role) {
            // Set default role to 'user' if not set
            this.http.patch(
              `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts/${key}.json`,
              { role: 'user' }
            ).subscribe();
          }
        }
      })
    ).subscribe();
  }
}