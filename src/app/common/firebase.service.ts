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
      //collection('cities');
      return this.firestore.collection('Chats').valueChanges();

     }

  getUsers(){
    // this.firestore.collection('Users').valueChanges().subscribe(data=>{
    //   this.users=data as Users[];
    //   console.log(this.users)
    // });
    //const citiesRef = this.firestore.doc<Users>('Users/id4').get().subscribe(dat=>{
     // console.log(dat.data,"Checking for doc data ");
    //});
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

  getCurrentUser(user:string):Observable<Users[]>{
    return this.firestore.collection('Users', (ref) => ref.where('email', '==', user).limit(1)).valueChanges() as Observable<Users[]>;
  }


}
