import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import { LoadersCssModule } from 'angular2-loaders-css';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { PushNotificationsModule } from 'angular2-notifications';
import { EmojiModule } from 'angular2-emoji';
import { EmojifyModule } from 'angular2-emojify';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DevExtremeModule } from 'devextreme-angular';
import { Service } from './providers/testService';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AF } from './providers/af';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { GroupComponent } from './group/group.component';
import { GroupChatComponent } from './group-chat/group-chat.component';

export const firebaseConfig = {
  apiKey: 'yourapikey',
  authDomain: 'your authDomain',
  databaseURL: 'yourdatabaseurl',
  storageBucket: 'yourStorageBucket',
  messagingSenderId: 'yourid'
};

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'inbox/:userid', component: InboxComponent },
  { path: 'privateChat/:recieverid', component: PrivateChatComponent },
  { path: 'group', component: GroupComponent },
  { path: 'groupChat', component: GroupChatComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    PrivateChatComponent,
    InboxComponent,
    GroupComponent,
    GroupChatComponent
  ],
  imports: [
    BrowserModule,
    LoadersCssModule,
    PushNotificationsModule,
    SimpleNotificationsModule,
    DevExtremeModule,
    FormsModule,
    EmojiModule,
    EmojifyModule,
    InfiniteScrollModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes),
    MaterialModule.forRoot(),
  ],
  providers: [AF, LocalStorageService, Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
