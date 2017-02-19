import { Component, OnInit, OnDestroy, Inject, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AF } from '../providers/af';
import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  public pvtMessages: FirebaseListObservable<any>;
  id: string;
  showLoader: boolean = true;
  private sub: any;
  public newMessage: string;
  withAnimationOptionsVisible: boolean;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor(private route: ActivatedRoute,
    @Inject(FirebaseApp) firebase: any,
    public af: AngularFire,
    public afService: AF,
    private _service: NotificationsService,

  ) {
    afService.chatStatusPublic = false;
    afService.chatStatusPrivate = true;
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['recieverid']; // (+) converts string 'id' to a number
      console.log(this.id);
      this.pvtMessages = this.af.database.list('privateMessages/' + this.id);
      this.pvtMessages.subscribe(snapshot => {
        this.showLoader = false;
      });
      // In a real app: dispatch action to load the details here.
    });
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  toggleWithAnimationOptions() {
    this.withAnimationOptionsVisible = !this.withAnimationOptionsVisible;
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log('Scroll to bottom failed yo!'); }
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
      this.pvtMessages.push(message);
      // this.afService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  goBack() {
    window.history.back();
  }
}
