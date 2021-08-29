import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AfterContentInit, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

export class ChatwindowComponent implements OnInit ,DoCheck,AfterContentInit,OnChanges{
/////////////////  Submit Data
text_submit:string=""


//////////////////////////////

  data!:chatfilterData
  records!:Chats[]
  chats_data?:Chats[]


  constructor(private sharedService:SharedataService,private fb:FirebaseService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes,"changes check ")

  }
  ngAfterContentInit(): void {

  }


  ngDoCheck(): void {
    console.log("docheck in docheck");

    this.data = this.getfuncData() as chatfilterData;
    this.chats_data=this.records;

    console.log(this.data,"check it out")
    console.log(this.records,"Check it yo")

    if(this.data){
      console.log("this.data", this.data)

      let chats_data =this.records.filter(chat =>
        ((chat.from==this.data.currentuser && chat.to == this.data.reciever) ||
        (chat.from==this.data.reciever && chat.to== this.data.currentuser))
      )
      this.chats_data = chats_data.sort((a,b) => {
        return a.timestamp - b.timestamp
      })
    }
  }

  ngOnInit(): void {


      console.log("whats inside")
      this.data = {currentuser:'clah',reciever:'ha'}
      console.log("filtershit",this.data)

      let obsChats: Observable<Chats[]>=this.fb.getChats() as Observable<Chats[]>;
      obsChats.subscribe((data)=> {
        this.records = data;
        this.chats_data = data;
        console.log(this.records as Chats[])
      })
  }

  getfuncData()
  {
    return this.sharedService.recieveData();
  }

  submitFunction(){

    var chat:Chats={} as Chats;
    if(!!this.text_submit){
      chat.from=this.data.currentuser;
      chat.text=this.text_submit;
      chat.to=this.data.reciever;
      chat.timestamp= new Date();
      console.log(chat,"Sending firebase data");
      this.fb.setChats(chat);
    }

  }


  }
