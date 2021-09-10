import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../common/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
//import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut,signInWithRedirect,getRedirectResult, createUserWithEmailAndPassword  } from "firebase/auth";
import { contact, Users } from '../chatdata';
import { FirebaseService } from '../common/firebase.service';
import { defalut_url } from '../global';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import firebase from 'firebase/compat';

declare var  gapi: any;
// function initClient() {
//   gapi.client.init({

//     //apiKey: "AIzaSyBzRjMCXqwmcRhnxWEzEqj2cxHVHsYiG6s",
//     apiKey: "AIzaSyCI7WHwyEuETJblo0b2LmeSY1NOJw3jUxE",
//    // clientId: "190509116805-i4r5ttb8l70r0pke3c673h4j9vcpc2io.apps.googleusercontent.com",
//     clientId: "190509116805-i4r5ttb8l70r0pke3c673h4j9vcpc2io.apps.googleusercontent.com",

//    discoveryDocs: "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
//     scope: "https://www.googleapis.com/auth/contacts.readonly"
//   }).then(function () {
//    }

//   );
// }

@Component({
  selector: 'app-login-or-sign-up',
  templateUrl: './login-or-sign-up.component.html',
  styleUrls: ['./login-or-sign-up.component.css']
})


export class LoginOrSignUpComponent implements OnInit {

  constructor(public authservice:AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private fb:FirebaseService ,
              private fire:AngularFirestore,
              ){}
              //public db: AngularFireDatabase) { }

  profileForm = new FormGroup({
    name: new FormControl('',[Validators.email,Validators.required]),
    password: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
  })

  ngOnInit(): void {


  };

  async login(){
    let contacts = await this.authservice.login()
    let userloggedin = {} as Users;
    this.authservice.user$.subscribe(data=>{

        if(data?.email){
          userloggedin.email=data.email;
        }
        if(data?.phoneNumber){
          userloggedin.phonenumber= data.phoneNumber;
        }
        if(data.photoURL){
          userloggedin.profilepic= data.photoURL;
        } else{
          userloggedin.profilepic = defalut_url
        }
        if(data?.displayName){
          userloggedin.name=data.displayName;
        }
        userloggedin.contacts=contacts
        this.createUser(userloggedin);

      }
  )

    console.log(userloggedin,"Loggged in user")

}


  createUser(userloggedin: Users) {
    let contacts =userloggedin.contacts as contact[]
    let docref:string[] = []

    let obs=this.fire.collection('Users',(ref) => ref.where('email', '==', userloggedin.email).limit(1)).get()
    obs.subscribe(async curruser=>{
      if(curruser.size==0){
        //add contact with out adding contacts
        //let adduser = userloggedin
        var clonedObj = Object.assign({}, userloggedin);
        clonedObj.contacts = []

        //let refid = await this.fire.collection('Users').add(clonedObj)
        //let docdata = await this.fire.firestore.collection('Users').doc(`Users/${refid}`).get();
        let refid = await this.fire.collection('Users').add(clonedObj)
        this.createContacts(refid.id,userloggedin.contacts as contact[])
        //create contacts
        // update
      }else{
        let id = curruser.docs[0].id
        let docdata = await this.fire.firestore.collection('Users').doc(`${id}`).get();
        this.Add_or_createContacts(docdata,userloggedin.contacts as contact[])
      }
    })
  }
  Add_or_createContacts(docdata: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>, contacts: contact[]) {
  let docrefcontacts:string[]=[]

    contacts.forEach(contact => {
      if(contact.email){

        let dem=this.fire.collection('Users',(ref) => ref.where('email', '==', contact.email?.toLowerCase())).get()
          dem.subscribe(data=>{

            if(data.empty){
              //add the contact
              this.fire.collection('Users').add(contact).then(value=>
              {
                docrefcontacts.push(value.id)
                //this keeps looping and updating the user object which must not happen
                //need a way to use the contact list outside subscribe and the foreach loop
                //not a fix !!! change implementation
                this.fire.collection('Users').doc(docdata.id).update({contacts: docrefcontacts})
              })
            } else if (!data.empty){
              //check if id is already present or populated in contacts array
              let userdata = docdata.data() as Users;
              //here contact must be the id
              let contact_info =data.docs[0].data() as Users
              if(!userdata.contacts.includes(data.docs[0].id)){
                docrefcontacts.push(data.docs[0].id)
                this.fire.collection('Users').doc(docdata.id).update({contacts: docrefcontacts})
              }
            }

          })

        }
        }
      )

  }

  createContacts(id: string, contacts: contact[]) {
    let docrefcontacts:string[]=[]

    contacts.forEach(contact => {
      if(contact.email){

        let dem=this.fire.collection('Users',(ref) => ref.where('email', '==', contact.email?.toLowerCase())).get()
          dem.subscribe(async data=>{

            if(data.empty){
              //add the contact
              this.fire.collection('Users').add(contact).then(value=>
              {
                docrefcontacts.push(value.id)
                //this keeps looping and updating the user object which must not happen
                //need a way to use the contact list outside subscribe and the foreach loop
                //not a fix !!! change implementation
                this.fire.collection('Users').doc(id).update({contacts: docrefcontacts})
              })
            }
            else if (!data.empty){
              //check if id is already present or populated in contacts array
              let userdocdata = await this.fire.firestore.collection('Users').doc(`${id}`).get()
              let curruserdata = userdocdata.data() as Users;
              //here contact must be the id
              let contact_info =data.docs[0].data() as Users
             if(!curruserdata.contacts.includes(data.docs[0].id)){
                docrefcontacts.push(data.docs[0].id)
                this.fire.collection('Users').doc(userdocdata.id).update({contacts: docrefcontacts})
              }
            }
          })

        }
        }
      )

  }




  // onSubmit(){


  //   this.authservice.userData.subscribe(data=>
  //     {
  //        //this.authservice.SignOut();
  //       if (data){
  //         console.log(data.email,"Checking Email on init ")
  //       }
  //       else{
  //         this.router.navigate(['signup'])
  //         console.log('nothing')
  //       }
  //     })


  // }

}
