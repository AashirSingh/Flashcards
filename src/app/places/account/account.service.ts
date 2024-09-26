import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Account } from './account.model';  // Fixed relative path

interface AccountData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  items: any[];
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = new BehaviorSubject<Account[]>([]);

  get accounts$() {
    return this._accounts.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  updateName(accountId: string, newName: string) {
    return this._accounts.pipe(
      take(1),
      switchMap(accounts => {
        const updatedAccountIndex = accounts.findIndex(acc => acc.id === accountId);
        const updatedAccounts = [...accounts];
        const oldAccount = updatedAccounts[updatedAccountIndex];
  
        updatedAccounts[updatedAccountIndex] = new Account(
          oldAccount.id,
          oldAccount.userId,
          newName, // Update the name
          oldAccount.email,
          oldAccount.phone,
          oldAccount.items
        );
  
        return this.http.put(
          "http://bookings-2bd51-default-rtdb.firebaseio.com//accounts/${accountId}.json",
          { ...updatedAccounts[updatedAccountIndex], id: null }
        ).pipe(
          tap(() => {
            this._accounts.next(updatedAccounts);
          })
        );
      })
    );
  }

  addName(
    userId: string,
    name: string,
    email: string,
    phone: string,
    items: any[]
  ) {
    let generatedId: string;
    const newAccount = new Account(
      Math.random().toString(), // generateId
      userId,
      name,
      email,
      phone,
      items
    );
    return this.http
      .post<{ name: string }>(
        "https://bookings-2bd51-default-rtdb.firebaseio.com/accounts.json",
        { ...newAccount, id: null }
      )
      .pipe(
        switchMap(resData => {
          const generatedId = resData.name;
          newAccount.id = generatedId;
          return this.accounts$.pipe(take(1));
        }),
        tap(accounts => {
          this._accounts.next(accounts.concat(newAccount));
        })
      );
  }

  deleteName(accountId: string) {
    return this.http
      .delete(
        `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts/${accountId}.json`
      )
      .pipe(
        switchMap(() => this._accounts.pipe(take(1))),
        tap(accounts => {
          this._accounts.next(accounts.filter(account => account.id !== accountId));
        })
      );
  }

  addPhone(
    userId: string,
    name: string,
    email: string,
    phone: string,
    items: any[]
  ) {
    const newAccount = new Account(
      Math.random().toString(), // generateId
      userId,
      name,
      email,
      phone,
      items
    );
  
    return this.http
      .post<{ name: string }>(
        "https://bookings-2bd51-default-rtdb.firebaseio.com/accounts.json",
        { ...newAccount, id: null }
      )
      .pipe(
        switchMap(resData => {
          const generatedId = resData.name;
          newAccount.id = generatedId;
          return this.accounts$.pipe(take(1));
        }),
        tap(accounts => {
          this._accounts.next(accounts.concat(newAccount));
        })
      );
  }


  fetchAccounts() {
    const userId = this.authService.userId;
    return this.http
      .get<{ [key: string]: AccountData }>(
        `https://bookings-2bd51-default-rtdb.firebaseio.com/accounts.json?orderBy="userId"&equalTo="${userId}"`
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
                  accountData[key].items
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
}
