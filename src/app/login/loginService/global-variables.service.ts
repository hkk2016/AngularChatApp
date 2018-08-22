import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  loggedInUser: string;
  isLoggedIn: boolean = false;
  redirectUrl: string;

  //private _loginOrLogout:string='Login';
  public isLoggedInChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn);
  public loggedInUserChanged: BehaviorSubject<string> = new BehaviorSubject<string>(this.loggedInUser);


  constructor() { }
  login(): Observable<boolean> {

    return of(true).pipe(
      delay(1000),
      tap((val) => {
        this.isLoggedIn = true;
        this.isLoggedInChanged.next(true);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.isLoggedInChanged.next(false);
  }
  getUserName(): string {
    return this.loggedInUser;
  }
  setUserName(userName: string) {
    this.loggedInUser = userName;
    this.loggedInUserChanged.next(userName);
  }


}
