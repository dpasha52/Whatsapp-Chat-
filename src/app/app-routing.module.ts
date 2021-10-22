import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOrSignUpComponent } from './login-or-sign-up/login-or-sign-up.component';
import { ChatsComponent } from './mobileapp/Chats/chats.component';
import { ContactsComponent } from './mobileapp/contacts/contacts.component';
import { MobileappComponent } from './mobileapp/mobileapp.component';
import { NavbarComponent } from './nav/navbar.component';
import { SignUPComponent } from './sign-up/sign-up.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'm/login', component:LoginOrSignUpComponent},
  { path: 'm/contacts', component:ContactsComponent},
  { path: 'm/chats', component:ChatsComponent},
  { path: 'updateprofile', component:UpdateProfileComponent},
  { path: 'login', component:  LoginOrSignUpComponent},
  { path:'signup', component: SignUPComponent},
  { path: 'app', component: NavbarComponent },
  { path: 'm/app', component: MobileappComponent  },
];

// export const mobroute: Routes = [
//   { path: 'updateprofile', component:UpdateProfileComponent},
// {},
// {}
// ]

//  let finalroute: boolean = false;
//  let routefinal :Routes=[]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }



