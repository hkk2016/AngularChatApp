import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from './loginService/global-variables.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 userName:string;
  constructor(private globalVariables:GlobalVariablesService,
              private _router:Router) { }

  ngOnInit() {
  }
  saveUser()
  {
    this.globalVariables.setUserName(this.userName);
    this._router.navigate(['chat'])
    
    
  }

}
