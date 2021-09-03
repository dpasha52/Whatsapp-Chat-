import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './nav/navbar.component';
import { NavleftComponent } from './nav/navleft/navleft.component';
import { NavrightComponent } from './nav/navright/navright.component';
import { NewchatComponent } from './newchat/newchat.component';
import { RecentMessagesComponent } from './recent-messages/recent-messages.component';
import { ChatwindowComponent } from './chatwindow/chatwindow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginOrSignUpComponent } from './login-or-sign-up/login-or-sign-up.component';
import { SignUPComponent } from './sign-up/sign-up.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavleftComponent,
    NavrightComponent,
    NewchatComponent,
    RecentMessagesComponent,
    ChatwindowComponent,
    LoginOrSignUpComponent,
    SignUPComponent,
    UpdateProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
