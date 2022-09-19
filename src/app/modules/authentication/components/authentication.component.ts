import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  isUserLoggedIn:boolean = false;
  private readonly _destroy = new Subject<void>();
  isloaderActive:any;

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
  private msalBroadCasrService:MsalBroadcastService,
  private authService:MsalService,private loginService:LoginService,private router:Router){}

  ngOnInit(){
    this.msalBroadCasrService.inProgress$.pipe
    (filter((interactionStatus:InteractionStatus)=>
    interactionStatus==InteractionStatus.None),
    takeUntil(this._destroy))
    .subscribe(x=>
      {
        this.isUserLoggedIn=this.authService.instance.getAllAccounts().length>0;
        // this.loginService.isUserLoggedIn.next(this.isUserLoggedIn);
        this.loginService.setLoginStatus(this.isUserLoggedIn)
        if(this.isUserLoggedIn){
          console.log("authenticated");
          this.router.navigate(['/home']);
          // this.isloaderActive = false;
        }
        else{
          console.log("not authenticated");
          this.authService.loginRedirect();
        }
      })
  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  login(){
    if(this.msalGuardConfig.authRequest){
      // this.isloaderActive = true;
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest)
    }
    else{
      // this.isloaderActive = true;
      this.authService.loginRedirect();
    }
  }

  logout(){
    this.authService.logoutRedirect({postLogoutRedirectUri:environment.postLogoutUrl});
  }

}
