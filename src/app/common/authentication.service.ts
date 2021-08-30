import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { async, Observable } from 'rxjs';
// import 'firebase/auth';
// import firebase from 'firebase/app';
// import Auth = firebase.auth.Auth;
// import User = firebase.User;
// import { auth } from 'firebase';
// import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData:Observable<any>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;

    //this.userData.subscribe(data=>{console.log(data,"Check it out")})
    //console.log(this.userData,"checking Auth State")

  }

  /* Sign up */
 async SignUp(email: string, password: string): Promise<any>{
  try{
    let res = this.angularFireAuth
    .createUserWithEmailAndPassword(email, password)
    return res;
    } catch(e) {
             console.log('errror', e)
    }
  }

  /* Sign in */
  SignIn(email: string, password: string) {
    let user_data:string|null=""

    this.angularFireAuth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log(res.user?.email,`'You're in!'`);
         user_data=res.user!.email;

      console.log(`'You're in!'`);
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
    });

  }


  /* Sign out */
  SignOut() {
  this.angularFireAuth
  .signOut().then(res=>{
    console.log('signout successfull')
  });
  }

  CheckUserMetadata(){
    this.angularFireAuth.authState.subscribe(user => {
      if (user){
        console.log(user.email)
      }
      else{
        console.log('nothing')
      }
   })
  }

}
