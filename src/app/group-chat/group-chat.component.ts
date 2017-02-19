import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { AF } from '../providers/af';
import { FirebaseListObservable, AngularFire, FirebaseApp } from 'angularfire2';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {
  public messages: FirebaseListObservable<any>;
  public roomName: any;
  public users: FirebaseListObservable<any>;
  public newMessage: string;
  userAvailableVisible: boolean;
  withAnimationOptionsVisible: boolean;
  withBackOptionsVisible: boolean;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  popupVisible: boolean = false;
  userListVisible: boolean = false;
  showLoader: boolean = true;
  userInRoom: any;
  constructor(
    public afService: AF,
    @Inject(FirebaseApp) public firebase,
    public af: AngularFire,
    private _service: NotificationsService,
  ) {
    // console.log(this.afService.routeParamName);
    this.roomName = this.afService.routeParamName;
    this.userInRoom = this.af.database.list('Groups/' + this.afService.routeParamName + '/users');
    this.messages = this.af.database.list('Groups/' + this.afService.routeParamName + '/messages');
    this.messages.subscribe(snapshot => {
      this.showLoader = false;
    });
    this.users = af.database.list('users');
  }
  toggleWithAnimationOptions() {
    this.withAnimationOptionsVisible = !this.withAnimationOptionsVisible;
  }
  toggleWithBackOptions() {
    this.withBackOptionsVisible = !this.withBackOptionsVisible;
  }
  userAvailableAnimationOptions() {
    this.userAvailableVisible = !this.userAvailableVisible;
  }
  showUsersAvailable() {
    this.userListVisible = true;
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
      let message = {
        message: this.newMessage,
        displayName: this.afService.displayName,
        email: this.afService.email,
        photoURL: this.afService.photoURL,
        timestamp: Date.now()
      };
      this.messages.push(message);
      this.newMessage = '';
    }
  }
  showUsers() {
    this.popupVisible = true;
  }
  addUser(userid, username, email, photoURL) {
    let usersRef = this.firebase.database().ref('Groups/' + this.afService.routeParamName + '/users');
    usersRef.on('value', (response) => {
      if (response.hasChild(userid)) {
        alert('User already exists in this room');
      } else {
        let usergroupref = this.firebase.database().ref('userGroups/' + userid);
        let userGroupInfo = {
          groupName: this.roomName,
          timestamp: Date.now(),
          photoURL: this.afService.photoURL,
          email: this.afService.email,
          displayName: this.afService.displayName
        };
        usergroupref.push(userGroupInfo);

        let groupUserref = this.firebase.database().ref('Groups/' + this.roomName + '/users/' + userid)
        let particularUserInfo = {
          displayName: username,
          photoURL: photoURL,
          email: email,
          uid: userid
        };
        groupUserref.set(particularUserInfo);
        this.popupVisible = false;
      }
    });

  }

  goBack() {
    window.history.back();
  }

}
