import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { async, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { version } from 'typescript';
import { FirebaseService } from './firebase.service';
import { contact, Users } from '../chatdata';
import { defalut_url } from '../global';
import { streetviewpublish } from 'googleapis/build/src/apis/streetviewpublish';

declare var gapi:any

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData:Observable<any>;
  user$: Observable<firebase.User | null>;
  people?:any[];

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;

     this.user$=this.angularFireAuth.authState;
     this.initClient();

  }
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: 'AIzaSyBzRjMCXqwmcRhnxWEzEqj2cxHVHsYiG6s',
        clientId: '190509116805-i4r5ttb8l70r0pke3c673h4j9vcpc2io.apps.googleusercontent.com',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest",],
        scope: 'https://www.googleapis.com/auth/contacts.readonly'
      })


      gapi.client.load("people","v1",()=>console.log("loaded People"))
    })
  }


  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    console.log(googleUser)
    //console.log(googleUser.getBasicProfile())
    const credential = firebase.auth.GoogleAuthProvider.credential(token);
    let contactlist = await this.getContactList();

    //let userCredential= await this.angularFireAuth.signInAndRetrieveDataWithCredential(credential);
    let userCredential = await this.angularFireAuth.signInWithCredential(credential)
    console.log(contactlist)
    return contactlist;
  }

  logout() {
    this.angularFireAuth.signOut();
  }

  async getContactList() {
    const people = await gapi.client.people.people.connections.list({
      'resourceName': 'people/me',
       'pageSize': 2000,
      'personFields': 'names,emailAddresses,phoneNumbers,photos',
    })

    console.log(people)
    // if(people.result.connections && people.result.connections.length>1000){
    //    people.result.nextPageToken
    // }


    console.log(people.result.connections)
    let contact :contact = {} as contact ;
    let contactlist:contact[] =[];
    let connections = people.result.connections

    // { names: string | any[]; emailAddresses: string | any[]; phoneNumbers: string | any[]; })
    if(!!connections){
      connections.forEach((person: { emailAddresses: string | any[]; names: string | any[]; phoneNumbers: string | any[]; photos: string | any[]; })  => {
        contact={} as contact
        //const patten = '^[\w.+\-]+@gmail\.com$'



        if (person.emailAddresses && person.emailAddresses.length > 0) {
            const patten= /^[\w.+\-]+@gmail\.com$/
            if(patten.test(person.emailAddresses[0].value.toLowerCase()))
            {
            if (person.names && person.names.length > 0) {
                contact.name = person.names[0].displayName
            }
            if (person.emailAddresses && person.emailAddresses.length > 0) {
              //console.log(person.emailAddresses[0].value);
              contact.email = person.emailAddresses[0].value
            }
            if (person.phoneNumbers && person.phoneNumbers.length > 0) {
              //console.log(person.phoneNumbers[0].value);
              contact.phonenumber=person.phoneNumbers[0].value
            }
            if(person.photos && person.photos.length >0) {
               contact.profilepic= person.photos[0].url
            } else{
              contact.profilepic = defalut_url
            }
            console.log(contact);
            contactlist.push(contact)
          }
        }
      });
    }
    return contactlist;
    //this.people = people.result.connections;

  }

}
