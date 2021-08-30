import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { Chats, Users } from '../chatdata';
import { AuthenticationService } from './authentication.service';

// import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  chats!: Chats[];
  users!:Users[];

  constructor(private firestore: AngularFirestore,private authservice:AuthenticationService) { }

    getChats(){
      // this.firestore.collection('Chats').valueChanges().subscribe(data=>
      //   {
      //     this.chats=data as Chats[];
      //     console.log(this.chats)
      //   });

      return this.firestore.collection('Chats').valueChanges();

     }

  getUsers(){
    // this.firestore.collection('Users').valueChanges().subscribe(data=>{
    //   this.users=data as Users[];
    //   console.log(this.users)
    // });
    return this.firestore.collection('Users').valueChanges();
  }

  setUser(data:Users){
    var val = this.firestore.collection('Users').add(data)
    val.then(data=> console.log(data))
  }

  setChats(data:Chats){
    // this.firestore.createId();
    var val = this.firestore.collection('Chats').add(data)
    val.then(data=> console.log(data))
    //console.log(data)

  }

  getCurrentUser(user:string){
    return this.firestore.collection('Users', (ref) => ref.where('email', '==', user ).limit(1)).valueChanges();
  }


}
