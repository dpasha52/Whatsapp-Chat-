import { Component, DoCheck, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Chats, UserMetaData, Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { GetrecentusersService } from '../common/getrecentusers.service';
import { SharedataService } from '../common/sharedata.service';

@Component({
  selector: 'app-recent-messages',
  templateUrl: './recent-messages.component.html',
  styleUrls: ['./recent-messages.component.css']
})
export class RecentMessagesComponent implements OnInit,DoCheck {
  clickcount:number=0
  obs!: Users[] | Observable<unknown[]>;
  chats!: Chats[];
  usersonInit!:Users[];
  users!:Users[];
  color:any;

  usermetadata:UserMetaData[]=[];


  constructor(private fb: FirebaseService, private shareData:SharedataService, private getrecentusers:GetrecentusersService,
    private authservice: AuthenticationService ) { }




  ngOnInit(): void {
    console.log("Im in Oninit of recent chat");
    let obsUsers: Observable<Users[]>=this.fb.getUsers() as Observable<Users[]>;
      obsUsers.subscribe( data =>
      {
         this.usersonInit=data
      })

      let obsChats: Observable<Chats[]>=this.fb.getChats() as Observable<Chats[]>;
        obsChats.subscribe(data=> {
          this.chats = data;


          this.authservice.userData.subscribe(data=>{
            const passvar = { users:this.usersonInit , chats: this.chats,usermetadata:this.usermetadata ,currentuser:data.email as string};

            this.users = this.getrecentusers.getLastMessageReturnActiveUsers(passvar).sort((a, b) => (a.count > b.count) ? -1 : 1);
          })


        })
  }
  ngDoCheck(): void {
    // const passvar = { users:this.usersonInit , chats: this.chats,usermetadata:this.usermetadata };
    // this.users = this.getrecentusers.getLastMessageReturnActiveUsers(passvar).sort((a, b) => (a.count > b.count) ? 1 : -1);

  }


  callInOninit(){
    if(this.users && this.clickcount==0){
   //   this.callFunct('dpasha52',this.users[0].name,false);
    }
  }

  callFunct(currentuser: any,reciever: any,clicked:boolean, imgurl:string){
    let data:any= {
    currentuser,reciever,imgurl
    }
    this.shareData.postData(data);
    if(clicked){
      this.clickcount++
    }
    // if(!clicked){
    //   this.callInOninit();
    // }
  }


}
