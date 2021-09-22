import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterContentInit, Component, DoCheck, ElementRef, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { chatfilterData, Chats, Users } from '../chatdata';
import { FirebaseService } from '../common/firebase.service';
import { SharedataService } from '../common/sharedata.service';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css']
})

export class ChatwindowComponent implements OnInit{
  /////////////////  Submit Data
  text_submit:string=""
  //////////////////////////////

  data!:chatfilterData
  records!:Chats[]
  chats_data?:Chats[]
  unknown:boolean = false
  imglist?:FileList;
  img?:File;
  downloadURLs!: string[];

  constructor(private sharedService:SharedataService,private fb:FirebaseService,private elementref:ElementRef,private ngf:AngularFirestore, private ngfs:AngularFireStorage) {
    this.sharedService.currentMessage.subscribe(data => {
        this.data=data as chatfilterData;
        if(this.data.currentuser!= undefined){
            this.ngOnInit();
        }
    })
   }


  ngOnInit(): void {

      if(this.data.currentuser!= undefined){
      let obsChats1: Observable<Chats[]>=this.fb.getCombinatedChats(this.data.currentuser,this.data.reciever) as Observable<Chats[]>;

      obsChats1.subscribe((data)=> {
        this.records = data;
        this.chats_data = data;
        this.unknown= this.data.unknown

        let sorted=this.chats_data.sort((a,b)=>a.timestamp.toDate()-b.timestamp.toDate())
        console.log(sorted as Chats[])

      })
    }

  }

  // upload(event :Event){

  //   const ip =event.target as HTMLInputElement
  //   if(ip.files){
  //     this.imglist= ip.files
  //   }

  // }



  async submitFunction(){
    var chat:Chats={} as Chats;
     var task;
     this.downloadURLs = [];

     if(!!this.text_submit && !!this.data.currentuser && !!this.data.reciever){

      //need to implement sending or recieving messages
      // if(this.imglist){
      //     for(var i =0; i< this.imglist.length; i++){

      //       task = this.ngfs.upload(`Chantimgandvids/${Date.now()}_${Math.random()}_${this.data.currentuser}`,this.imglist.item(i));
      //       const fileRef = this.ngfs.ref(`Chantimgandvids/${Date.now()}_${Math.random()}_${chat.from}`);
      //       task.snapshotChanges().pipe(
      //         finalize(() => {
      //           fileRef.getDownloadURL().subscribe((url) => {
      //             this.downloadURLs = this.downloadURLs.concat([url]);
      //           });
      //         })
      //       ).subscribe();
      //     }
      // }


      chat.from=this.data.currentuser;

      chat.text=this.text_submit;
      chat.to=this.data.reciever;
      chat.timestamp= new Date();

      // this logic is flawed as we are unable to filter contacts thus we are adding a flag list here to indicate unknown contact
      let userdocdata = await this.ngf.firestore.collection("Users").where('email','==',chat.to).limit(1).get()
      let user = userdocdata.docs[0].data() as Users
      let curdocdata =  await this.ngf.firestore.collection("Users").where('email','==',chat.from).limit(1).get()
      let curruser = curdocdata.docs[0].data() as Users
      if (user.contacts.includes(curdocdata.docs[0].id)){
        this.fb.setChats(chat);
      }
      else{
        //update only the field
        let unknowncontacts = user.unknowncontacts;
        if(!!unknowncontacts && !unknowncontacts!.includes(curdocdata.docs[0].id))
        unknowncontacts!.push(curdocdata.docs[0].id)
        this.ngf.collection('Users').doc(userdocdata.docs[0].id).update({unknowncontacts: unknowncontacts})
        this.fb.setChats(chat);
      }
    }
  }

  async AddtoContact(){
    let userdocdata = await this.ngf.firestore.collection("Users").where('email','==',this.data.reciever).limit(1).get()
    let user = userdocdata.docs[0].data() as Users
    let curdocdata =  await this.ngf.firestore.collection("Users").where('email','==',this.data.currentuser).limit(1).get()
    let curruser = curdocdata.docs[0].data() as Users

    curruser.unknowncontacts!.splice(curruser.unknowncontacts!.indexOf(userdocdata.docs[0].id),1);
    curruser.contacts.push(userdocdata.docs[0].id);
    let uk = curruser.unknowncontacts;
    let cts= curruser.contacts;
    this.ngf.collection('Users').doc(curdocdata.docs[0].id).update({unknowncontacts: uk, contacts:cts})
    this.sharedService.postevent(1);
    this.data.unknown=false;
    this.ngOnInit();
  }

  async RemovefromContacts(){
    let userdocdata = await this.ngf.firestore.collection("Users").where('email','==',this.data.reciever).limit(1).get()
    let user = userdocdata.docs[0].data() as Users
    let curdocdata =  await this.ngf.firestore.collection("Users").where('email','==',this.data.currentuser).limit(1).get()
    let curruser = curdocdata.docs[0].data() as Users

    curruser.unknowncontacts!.splice(curruser.unknowncontacts!.indexOf(userdocdata.docs[0].id),1);
    let uk = curruser.unknowncontacts;
    this.ngf.collection('Users').doc(curdocdata.docs[0].id).update({unknowncontacts: uk})
    this.sharedService.postevent(false);
    this.data.unknown=false;
    this.unknown=false;
    this.data.currentuser = undefined;
    this.ngOnInit();
  }
}


