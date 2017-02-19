import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Inject } from '@angular/core';
import { AF } from '../providers/af';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import { FirebaseListObservable, AngularFire, FirebaseApp } from 'angularfire2';
import { PushNotificationsService } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { Service } from '../providers/testService';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewChecked {
  popupVisible: boolean = false;
  loggedInUserEmail: any;
  withAnimationOptionsVisible: boolean;
  facebookInfoVisible: boolean;
  twitterInfoVisible: boolean;
  stackInfoVisible: boolean;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public options = {
    position: ['top', 'right'],
    timeOut: 5000,
    lastOnBottom: true,
    showProgressBar: true,
  };
  public newMessage: string;
  public messages: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  public messageUrl: any;
  public messageInside: any;
  showLoader: boolean = true;
  constructor(public afService: AF,
    service: Service,
    private _service: NotificationsService,
    public af: AngularFire,
    private router: Router,
    @Inject(FirebaseApp) public firebase,
    private localstorage: LocalStorageService,
    private _pushNotifications: PushNotificationsService) {
    let messages = firebase.database().ref('messages');
    let email = localStorage.getItem('email');
    messages.orderByChild('timestamp').startAt(Date.now()).on('child_added', (snapshot) => {
      console.log(snapshot.val());
      console.log(localStorage.getItem('background'));
      if (localStorage.getItem('background') === 'true') {
        if (email !== snapshot.val().email) {
          let sound = new Audio();
          // tslint:disable-next-line:max-line-length
          sound.src = 'https://firebasestorage.googleapis.com/v0/b/chatapp-a9558.appspot.com/o/sounds%2Fstrum.mp3?alt=media&token=ba2718e4-f996-43b0-b6fd-b55c5b6b9a46';
          sound.load();
          sound.play();
          this._pushNotifications.create(snapshot.val().displayName,
            {
              body: snapshot.val().message, icon: snapshot.val().photoURL
            }).subscribe(
            res => console.log(res),
            err => console.log(err)
            );
        }
      }
    });
    this.messages = this.afService.messages;
    this.messages.subscribe(snapshot => {
      this.showLoader = false;
    });
    this.users = this.afService.users;
    afService.chatStatusPublic = true;
    afService.chatStatusPrivate = false;
  }
  toggleWithAnimationOptions() {
    this.withAnimationOptionsVisible = !this.withAnimationOptionsVisible;
  }

  toggleFacebookInfoOptions() {
    this.facebookInfoVisible = !this.facebookInfoVisible;
  }
  toggleTwitterInfoOptions() {
    this.twitterInfoVisible = !this.twitterInfoVisible;
  }
  toggleStackInfoOptions() {
    this.stackInfoVisible = !this.stackInfoVisible;
  }
  showUsers(users) {
    this.loggedInUserEmail = this.afService.email;
    console.log(this.loggedInUserEmail);
    this.popupVisible = true;
  }
  onScrollDown() {
    console.log('onscrolldown');
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  getUnique(a, b) {
    return [a.toString(), b.toString()].sort().join('');
  }
  createPrivateRoom(recieveruid, displayName, email, photoURL) {
    console.log(this.getUnique(recieveruid, this.afService.loggedUseruid));
    console.log(this.getUnique(this.afService.loggedUseruid, recieveruid));
    let senderData = {
      senderId: recieveruid,
      displayName: displayName,
      email: email,
      photoURL: photoURL,
      timestamp: Date.now()
    };
    let senderDatabaseRef = this.firebase.database().ref('userMessages/' + this.afService.loggedUseruid + '/' + recieveruid);
    senderDatabaseRef.set(senderData);
    let receiverData = {
      senderId: this.afService.loggedUseruid,
      displayName: this.afService.displayName,
      email: this.afService.email,
      photoURL: this.afService.photoURL,
      timestamp: Date.now()
    };
    let receiverDatabaseRef = this.firebase.database().ref('userMessages/' + recieveruid + '/' + this.afService.loggedUseruid);
    receiverDatabaseRef.set(receiverData);
    let uniqueID = this.getUnique(recieveruid, this.afService.loggedUseruid);
    let privateRoom = ['/privateChat', uniqueID];
    this.router.navigate(privateRoom);
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log('Scroll to bottom failed yo!'); }
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  isYou(email) {
    if (email === this.afService.email) {
      return true;
    } else {
      return false;
    }
  }

  isMe(email) {
    if (email === this.afService.email) {
      return false;
    } else {
      return true;
    }
  }

  sendMessage() {
    if (this.newMessage === '' || this.newMessage === undefined) {
      this._service.success(
        'Empty Message',
        'Empty message wont be sent',
        {
          timeOut: 2000,
          showProgressBar: true,
          clickToClose: true,
        }
      );
    } else {
      this.afService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }


}
