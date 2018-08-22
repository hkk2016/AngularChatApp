import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from './loginService/global-variables.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string;
  loginHelpMessage: string;

  loggedInUser:string; //for logout panel
  isUserLoggedIn:boolean=false;
  constructor(private loginService: GlobalVariablesService,
    private _router: Router) { }

  ngOnInit() {
  this.loggedInUser=this.loginService.getUserName();
  this.isUserLoggedIn=this.loginService.isLoggedIn;
  }
  setMessage() {
    this.loginHelpMessage = 'Logged ' + (this.loginService.isLoggedIn ? 'in' : 'out');
  }
  loginUser() {
    this.loginHelpMessage = 'Trying to log in ...';

    this.loginService.login().subscribe(() => {
      this.setMessage();
      if (this.loginService.isLoggedIn) {

        this.loginService.setUserName(this.userName);
        
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/home';
        
        // Redirect the user
        this._router.navigate([redirect]);
      }
    });


    //this.loginService.setUserName(this.userName);
    //this._router.navigate(['chat'])


  }

  logoutUser() {
    this.loginService.logout();
    this.setMessage();
    this._router.navigate(['/home']);
  }

}
