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
  cuurentUser: any;
  userinfo!: Users;
  currentUsername!: string;
  users_recent!: Users[];


  constructor(private fb: FirebaseService, private shareData:SharedataService, private getrecentusers:GetrecentusersService,
    private authservice: AuthenticationService ) { }




  ngOnInit(): void {
    console.log("Im in Oninit of recent chat");
    this.authservice.userData.subscribe(cuurentUser=>{
      this.cuurentUser=cuurentUser.email;
      this.fb.getCurrentUser(this.cuurentUser).subscribe(data=>
      {
        console.log("Getting current user")
        this.userinfo= data[0];
        this.currentUsername=this.userinfo.name;
        console.log(this.userinfo,"Check data recieved ")
        console.log(data[0],"Check data recieved ")
          if(this.userinfo.contacts != undefined && this.userinfo.contacts.length>0){
            console.log("check we are coming here")
            console.log("we have contacts")
            this.fb.getUsers().subscribe(users=>
              {

                this.usersonInit=users as Users[];
                console.log('Part 1:',this.usersonInit)
                this.usersonInit =this.usersonInit.filter(item=>(item.contacts != undefined && item.contacts.length > 0)
                &&(item.email != this.cuurentUser )
                  &&(item.contacts.includes(this.userinfo.email)||item.contacts.includes(this.userinfo.phonenumber)
                  )
                  )
                console.log(this.usersonInit,"Users on init");

                this.usersonInit.sort((a:Users,b:Users) =>{
                  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    // names must be equal
                    return 0;
                  })
                  console.log(this.usersonInit)


                  let obsChats: Observable<Chats[]>=this.fb.getChats() as Observable<Chats[]>;
                  obsChats.subscribe(data=> {
                    this.chats = data;

                      const passvar = { users:this.usersonInit , chats: this.chats,usermetadata:this.usermetadata ,currentuser:this.currentUsername as string};
                      this.users_recent = this.getrecentusers.getLastMessageReturnActiveUsers(passvar).sort((a, b) => (a.count > b.count) ? -1 : 1);
                  })
                })
          }
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
