import { Component, OnInit, Inject } from '@angular/core';
import { AF } from '../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire, FirebaseApp } from 'angularfire2';
import { NotificationsService } from 'angular2-notifications';



@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public groups: FirebaseListObservable<any>;
  showLoader: boolean = true;
  public groupName: any;
  constructor(
    private router: Router,
    private _service: NotificationsService,
    @Inject(FirebaseApp) public firebase,
    public af: AngularFire,
    public afService: AF
  ) {
    this.groups = this.af.database.list('userGroups/' + this.afService.loggedUseruid);
    this.groups.subscribe(snapshot => {
      this.showLoader = false;
    });
  }

  ngOnInit() {
  }
  createNewRoom() {
    if (this.groupName === '' || this.groupName === undefined) {
      alert('groupName cannot be empty');
    } else {
      let groupRef = this.firebase.database().ref('Groups/' + this.groupName);
      groupRef.on('value', (response) => {
        if (response.exists()) {
          // alert('group already exists');
        } else {
          let usergroupref = this.firebase.database().ref('userGroups/' + this.afService.loggedUseruid);
          let groupchatMessageref = this.firebase.database().ref('Groups/' + this.groupName + '/messages');
          let groupchatUsersref = this.firebase.database().ref('Groups/' + this.groupName + '/users/' + this.afService.loggedUseruid);
          let initialMessage = {
            message: this.afService.displayName + ' created this room',
            displayName: this.afService.displayName,
            email: this.afService.email,
            photoURL: this.afService.photoURL,
            timestamp: Date.now()
          };
          groupchatMessageref.push(initialMessage);
          let userInParticularGroup = {
            displayName: this.afService.displayName,
            email: this.afService.email,
            photoURL: this.afService.photoURL,
            uid: this.afService.loggedUseruid
          };
          groupchatUsersref.set(userInParticularGroup);
          let userGroupInfo = {
            groupName: this.groupName,
            timestamp: Date.now(),
            photoURL: this.afService.photoURL,
            email: this.afService.email,
            displayName: this.afService.displayName
          };
          usergroupref.push(userGroupInfo);
          this.groupName = '';
        }
      });
    }
  }
  chatRoom(roomName) {
    this.afService.routeParamName = roomName;
    this.router.navigate(['/groupChat']);

  }


}
