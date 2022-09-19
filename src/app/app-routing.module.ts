import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './modules/authentication/components/authentication.component';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[MsalGuard]
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[MsalGuard]
  },
  {
    path:'',
    component:AuthenticationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    initialNavigation:'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
