import { Injectable }     from '@angular/core';
import {GlobalVariablesService} from './loginService/global-variables.service';
import {CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{
  constructor(private loginService:GlobalVariablesService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
  {

    let url: string = state.url;

    return this.checkLogin(url);
  }
  checkLogin(url: string): boolean {
    if (this.loginService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.loginService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  
}
