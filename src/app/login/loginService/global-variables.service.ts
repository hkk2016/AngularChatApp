import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  loggedInUser:string;

  constructor() { }
  
  getUserName():string
  {
    return this.loggedInUser;
  }
  setUserName(userName:string)
  {
    this.loggedInUser=userName;
  }

}
