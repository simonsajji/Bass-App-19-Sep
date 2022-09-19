import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmBoxComponent } from './components/confirm-box/confirm-box.component';
import { HeaderComponent } from './components/header/header.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoginService } from './services/login.service';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule} from 'ngx-toastr';
import { ToastrServices } from './services/toastr.service';
import { HomeComponent } from './components/home/home.component';
import { MatDialog } from '@angular/material/dialog';
// import { AuthenticationComponent } from './modules/authentication/components/authentication.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { DetailsComponent } from './components/details/details.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';

const isIE = window.navigator.userAgent.indexOf('MSIE')>-1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    ConfirmBoxComponent,
    HeaderComponent,
    ContextMenuComponent,
    ProfileComponent,
    HomeComponent,
    SkeletonLoaderComponent,
    DetailsComponent,
    LeftMenuComponent,
    // AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    NgxSkeletonLoaderModule,
    ToastrModule.forRoot({
      positionClass :'toast-top-right',
      preventDuplicates: true
    }),
    MatProgressSpinnerModule,
    MsalModule.forRoot(new PublicClientApplication(
      {
        auth:{
          clientId:'977e7d3b-d6af-4e9c-bcc4-c8bdaf310ec0',
          redirectUri:'http://localhost:4200',
          authority:'https://login.microsoftonline.com/34c25798-fa80-4e05-b8ee-454fec6f8be8'

        },
        cache:{
          cacheLocation:'localStorage',
          storeAuthStateInCookie:isIE
        }
      }
    ),
    {
      interactionType:InteractionType.Redirect,
      authRequest:{
        scopes:['user.read','group.Read.All']
      }
    },
    {
      interactionType:InteractionType.Redirect,
      protectedResourceMap:new Map(
        [
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
          ['https://graph.microsoft.com/v1.0/groups', ['group.read.all']]
        ]
      )
    })
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:MsalInterceptor,
    multi:true
  },
  MsalGuard,LoginService,ApiService,ToastrServices],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
