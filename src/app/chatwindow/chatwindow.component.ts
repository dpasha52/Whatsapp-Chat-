import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterContentInit, Component, DoCheck, ElementRef, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
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

  constructor(private sharedService:SharedataService,private fb:FirebaseService,private elementref:ElementRef,private ngf:AngularFirestore) {
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

        let sorted=this.chats_data.sort((a,b)=>a.timestamp.toDate()-b.timestamp.toDate())
        console.log(sorted as Chats[])

      })
    }

  }


  async submitFunction(){
    var chat:Chats={} as Chats;
    if(!!this.text_submit && !!this.data.currentuser && !!this.data.reciever){
      chat.from=this.data.currentuser;

      chat.text=this.text_submit;
      chat.to=this.data.reciever;
      chat.timestamp= new Date();

      // let dummydata = Math.random();
      // this.sharedService.postevent(dummydata);

      let userdocdata = await this.ngf.firestore.collection("Users").where('name','==',chat.to).limit(1).get()
      let user = userdocdata.docs[0].data() as Users
      let curdocdata =  await this.ngf.firestore.collection("Users").where('name','==',chat.from).limit(1).get()
      let curruser = curdocdata.docs[0].data() as Users
      if (user.contacts.includes(curdocdata.docs[0].id)){
        this.fb.setChats(chat);
      }
      else{
        //update only the field
        let unknowncontacts = user.unknowncontacts


      }

//      let userdocdata = await this.ngf.firestore.collection("Users").where('name','==',chat.to).limit(1).get()
  //    let user = userdocdata.docs[0].data() as Users
  //    let curruserdocdata = await this.ngf.firestore.collection("Users").where('name','==',chat.from).limit(1).get();
   //   let curruser = curruserdocdata.docs[0].data() as Users

      // if (!user.contacts.includes(curruser.customID)){
      //   //add unknown users
      //     if(!user.unknowncontacts){
      //       user.unknowncontacts=[]
      //       user.unknowncontacts.push(curruser.customID)
      //     }else{
      //       user.unknowncontacts.push(curruser.customID)
      //     }
      // }

    }

  }


}


