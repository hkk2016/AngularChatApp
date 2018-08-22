import { Component } from '@angular/core';
import { GlobalVariablesService } from './login/loginService/global-variables.service'
//import * as io from "socket.io-client";
import { OnInit } from '@angular/core'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  loggedInUserName:string;
  constructor(private loginService: GlobalVariablesService) {
    console.log("Main component called:");
  }
  ngOnInit() {
    this.loginService.isLoggedInChanged.subscribe((newVal) => {
      this.isLoggedIn = newVal;
      //console.log(this.isLoggedIn);
    });

    this.loginService.loggedInUserChanged.subscribe((userName)=>
  {
    this.loggedInUserName=this.loginService.getUserName();
  })
    
  }

}
