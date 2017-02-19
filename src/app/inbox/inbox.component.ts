import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AF } from '../providers/af';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, OnDestroy {
  private sub: any;
  showLoader: boolean = true;
  public loggedInUserEmail: any;
  messagerList: FirebaseListObservable<any>;
  id: string;
  constructor(private route: ActivatedRoute,
    @Inject(FirebaseApp) public firebase,
    public af: AngularFire,
    private router: Router,
    private localstorage: LocalStorageService,
    public afService: AF) {
    this.loggedInUserEmail = localStorage.getItem('email');
  }
  getUnique(a, b) {
    return [a.toString(), b.toString()].sort().join('');
  }
  createPrivateRoom(recieveruid, displayName, email, photoURL) {
    console.log(recieveruid);
    console.log(this.afService.loggedUseruid);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['userid']; // (+) converts string 'id' to a number
      console.log(this.id);
      this.messagerList = this.af.database.list('userMessages/' + this.id, {});
      this.messagerList.subscribe(snapshot => {
        this.showLoader = false;
      });
      // In a real app: dispatch action to load the details here.
    });
  }

}
