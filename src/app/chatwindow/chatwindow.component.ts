import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterContentInit, Component, DoCheck, ElementRef, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { chatfilterData, Chats } from '../chatdata';
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

  constructor(private sharedService:SharedataService,private fb:FirebaseService,private elementref:ElementRef) {
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


  submitFunction(){
    var chat:Chats={} as Chats;
    if(!!this.text_submit){
      chat.from=this.data.currentuser;

      chat.text=this.text_submit;
      chat.to=this.data.reciever;

      chat.timestamp= new Date();
      this.fb.setChats(chat);
    }

  }


}


