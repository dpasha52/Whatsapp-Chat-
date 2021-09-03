import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOrSignUpComponent } from './login-or-sign-up/login-or-sign-up.component';
import { NavbarComponent } from './nav/navbar.component';
import { SignUPComponent } from './sign-up/sign-up.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'updateprofile', component:UpdateProfileComponent},
  { path: 'login', component:  LoginOrSignUpComponent},
  { path:'signup', component: SignUPComponent},
  { path: 'app', component: NavbarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
