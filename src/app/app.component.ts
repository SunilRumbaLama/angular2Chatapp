import { Component, OnInit, Inject } from '@angular/core';
import { AF } from './providers/af';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import { PushNotificationsService } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { FirebaseApp } from 'angularfire2';

@Component({
  providers: [LocalStorageService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  public loggedUser: string;
  public photoURL: string;
  public displayName: string;
  public chatStatus: string;

  /**constructor */
  constructor(public afService: AF,
    private router: Router,
    private _service: NotificationsService,
    @Inject(FirebaseApp) firebase: any,
    private localstorage: LocalStorageService,
    private _pushNotifications: PushNotificationsService) {
    afService.chatStatusPublic = true;
    afService.chatStatusPrivate = false;
    // This asynchronously checks if our user is logged it and will automatically
    // redirect them to the Login page when the status changes.
    // This is just a small thing that Firebase does that makes it easy to use.
    this._pushNotifications.requestPermission();
    this.afService.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          this.router.navigate(['login']);
          this.isLoggedIn = false;
        } else {
          // UPDATE: I forgot this at first. Without it when a user is logged in and goes directly to /login
          // the user did not get redirected to the home page.
          console.log(auth.google);
          let user = {
            email: auth.google.email,
            uid: auth.google.uid,
            displayName: auth.google.displayName,
            photoURL: auth.google.photoURL
          };
          let dbRef = firebase.database().ref('users/' + auth.google.uid);
          dbRef.set(user).then((response) => {
            this._service.success(
              'User',
              'User Database successfully setup',
              {
                timeOut: 2000,
                showProgressBar: true,
                clickToClose: true,
              }
            );
          });
          this.afService.displayName = auth.google.displayName;
          this.afService.email = auth.google.email;
          this.afService.photoURL = auth.google.photoURL;
          this.afService.loggedUseruid = auth.google.uid;
          localStorage.setItem('email', auth.google.email);
          this.loggedUser = auth.google.email;
          this.photoURL = auth.google.photoURL;
          this.displayName = auth.google.displayName;
          this.isLoggedIn = true;
          this.router.navigate(['']);
        }
      }
    );
  }

  inbox() {
    let inboxRoom = ['/inbox', this.afService.loggedUseruid];
    this.router.navigate(inboxRoom);
  }
  home() {
    this.router.navigate(['']);
  }
  userGroup() {
    this.router.navigate(['/group']);
  }
  logout() {
    localStorage.clear();
    this.afService.logout();
  }
  ngOnInit() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        localStorage.setItem('background', 'true');
        // console.log('background');
      } else {
        localStorage.setItem('background', 'false');
        // console.log('foreground');
      }
    });
  }
}