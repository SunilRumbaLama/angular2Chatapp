// src/app/providers/af.ts
import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import { PushNotificationsService } from 'angular2-notifications';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseApp } from 'angularfire2';
@Injectable()
@Injectable()
export class AF {
  public messages: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  routeParamName: any;
  public displayName: string;
  public photoURL: string;
  public email: string;
  public firebase: any;
  public chatStatusPublic = false;
  public chatStatusPrivate = false;
  public loggedUseruid: any;
  constructor(public af: AngularFire,
    private localstorage: LocalStorageService,
    @Inject(FirebaseApp) firebase: any,
    public _pushNotifications: PushNotificationsService,
  ) {
    this.users = af.database.list('users');
    this.messages = af.database.list('messages', {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 8
      }
    });
  }
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }
  /**
   * Logs out the current user
   */
  logout() {
    return this.af.auth.logout();
  }
  /**
   * Saves a message to the Firebase Realtime Database
   * @param text
   */
  sendMessage(text) {
    let message = {
      message: text,
      displayName: this.displayName,
      email: this.email,
      photoURL: this.photoURL,
      timestamp: Date.now()
    };
    this.messages.push(message);
  }
}