import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';

import { Account } from './account.model';
import { AuthService } from '../../auth/auth.service';

interface AccountData {
  userId: string;
  name: string;
  email: string;
  phone: string;
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
    return this.http
      .get<{ [key: string]: AccountData }>(
        `https://bookings-abeec-default-rtdb.firebaseio.com/accounts.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map(accountData => {
          const accounts: Account[] = [];
          for (const key in accountData) {
            if (accountData.hasOwnProperty(key)) {
              accounts.push(
                new Account(
                  key,
                  accountData[key].userId,
                  accountData[key].name,
                  accountData[key].email,
                  accountData[key].phone,
                  accountData[key].items,
                  accountData[key].role // Fetch role
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

  addName(
    userId: string,
    name: string,
    email: string,
    phone: string,
    items: any[],
    role: string = 'user' // Default role is 'user'
  ) {
    let generatedId: string;
    const newAccount = new Account(
      Math.random().toString(),
      userId,
      name,
      email,
      phone,
      items,
      role // Add role while creating new account
    );
    return this.http
      .post<{ name: string }>(
        'https://bookings-abeec-default-rtdb.firebaseio.com/accounts.json',
        { ...newAccount, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this._accounts;
        }),
        take(1),
        tap(accounts => {
          newAccount.id = generatedId;
          this._accounts.next(accounts.concat(newAccount));
        })
      );
  }

  //Adds user and admin role field for existing accounts in firebase
  updateRoleForExistingAccounts() {
    this.http.get<{ [key: string]: AccountData }>(
      `https://bookings-abeec-default-rtdb.firebaseio.com/accounts.json`
    )
    .pipe(
      map(accountData => {
        for (const key in accountData) {
          if (accountData.hasOwnProperty(key) && !accountData[key].role) {
            // If the account doesn't have a role, set it to 'user' by default
            this.http.patch(
              `https://bookings-abeec-default-rtdb.firebaseio.com/accounts/${key}.json`,
              { role: 'user' }  // Set default role to 'user' or 'admin'
            ).subscribe();
          }
        }
      })
    ).subscribe();
  }
}