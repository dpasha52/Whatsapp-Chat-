import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';
import { combineLatest, Observable } from 'rxjs';
import { map, share, shareReplay, timestamp } from 'rxjs/operators';
import { Chats, Users } from '../chatdata';
import { AuthenticationService } from './authentication.service';
import {merge} from 'rxjs'

// import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  chats!: Chats[];
  users!:Users[];

  constructor(private firestore: AngularFirestore,private authservice:AuthenticationService) { }


  getCombinatedChats(contact:string, username:string): Observable<Chats[]> {

    //works dont know how need to learn rxjs observables
    //very complicated not returning results as it is supposed to

    const $one=   this.firestore.collection('Chats', ref => ref.where('from','==',username).where('to','==',contact))
    .valueChanges();

    const $two = this.firestore.collection('Chats', ref => ref.where('from','==',contact).where('to','==',username))
    .valueChanges();

      return combineLatest([$one,$two]).pipe(
              map(([one, two]) => [...one, ...two])
        ) as  Observable<Chats[]>
  }

    // getChats ():Observable<Chats[]>{
    //   return this.firestore.collection('Chats').valueChanges() as Observable<Chats[]>;
    // }


  getUsers(){
    return this.firestore.collection('Users').valueChanges();
  }

  setUser(data:Users){
    var val = this.firestore.collection('Users').add(data)
    val.then(data=> console.log(data))
  }

  updateUserInfo(docid:any, data:Users){
    this.firestore.collection('Users').doc(docid).update(data);
  }

  setChats(data:Chats){
    // this.firestore.createId();
    var val = this.firestore.collection('Chats').add(data)
    //val.then(data=> console.log(data))
    //console.log(data)

  }

  // :Observable<Users[]>
  getCurrentUser(user:string){

    return this.firestore.collection('Users', (ref) => ref.where('email', '==', user).limit(1)).valueChanges({ idField: 'customID' }) as Observable<Users[]>;
      //return this.firestore.collection('Users', (ref) => ref.where('email', '==', user).limit(1)).

}

  getcontact(id:string){
    return this.firestore.collection('Users').doc(id).get()
  }


}
