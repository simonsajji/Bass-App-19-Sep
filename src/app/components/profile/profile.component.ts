import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { InteractionRequiredAuthError, AuthError } from 'msal';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/groups';
const GRAPH_ENDPOINT_USER = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  group:any;
  currentProfile:any;

  constructor(private authService: MsalService, private http: HttpClient) { }

  ngOnInit() {
    this.getGroups();
    this.getUserProfile();
  }

  getGroups() {
    this.http.get(GRAPH_ENDPOINT)
    .subscribe({
      next: (group) => {
        this.group = group;
        console.log(this.group);
        // console.log( this.auth)
      },
      error: (err: AuthError) => {
        // If there is an interaction required error,
        // call one of the interactive methods and then make the request again.
        if (InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)) {
          this.authService.acquireTokenPopup({
            scopes: ['group.Read.All']
          })
          .subscribe(() => {
            this.http.get(GRAPH_ENDPOINT)
              .toPromise()
              .then(group => {
                this.group = group;
                console.log(this.group)
              });
          });
        }
      }
    });
  }
  getUserProfile() {
    this.http.get(GRAPH_ENDPOINT_USER)
    .subscribe({
      next: (currentProfile) => {
        this.currentProfile = currentProfile;
        console.log(this.currentProfile);
      },
      error: (err: AuthError) => {
        // If there is an interaction required error,
        // call one of the interactive methods and then make the request again.
        if (InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)) {
          this.authService.acquireTokenPopup({
            scopes: ['group.Read.All']
          })
          .subscribe(() => {
            this.http.get(GRAPH_ENDPOINT_USER)
              .toPromise()
              .then(currentProfile => {
                this.currentProfile = currentProfile;
                console.log(this.currentProfile)
              });
          });
        }
      }
    });
  }
}