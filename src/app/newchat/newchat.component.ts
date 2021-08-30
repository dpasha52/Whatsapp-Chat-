import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Chats, UserMetaData, Users } from '../chatdata';
import { FirebaseService } from '../common/firebase.service';
import { GetrecentusersService } from '../common/getrecentusers.service';
import { SharedataService } from '../common/sharedata.service';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  clickcount:number=0
  obs!: Users[] | Observable<unknown[]>;
  chats!: Chats[];
  usersonInit!:Users[];
  users_recent!:Users[];
  usermetadata:UserMetaData[]=[];
  color:any;


  @Input() toggletrue !: boolean;
  @Output() toggletrueChange = new EventEmitter();

  constructor(private fb:FirebaseService,private shareData:SharedataService,private getrecentusers:GetrecentusersService) { }

  ngOnInit(): void {

    console.log("Im in Oninit of recent chat");
    let obsUsers: Observable<Users[]>=this.fb.getUsers() as Observable<Users[]>;
      obsUsers.subscribe( data =>
      {
         this.usersonInit=data.filter(user=>(user.name!='dpasha52'))
      })

      let obsChats: Observable<Chats[]>=this.fb.getChats() as Observable<Chats[]>;
        obsChats.subscribe(data=> {
          this.chats = data;
        //  const passvar = { users:this.usersonInit , chats: this.chats,usermetadata:this.usermetadata };
         // this.users_recent = this.getrecentusers.getLastMessageReturnActiveUsers(passvar).sort((a, b) => (a.count > b.count) ? -1 : 1);
        })
  }
  tooglefunc(){
    this.toggletrue= !this.toggletrue;
    this.toggletrueChange.emit(this.toggletrue);
    console.log(this.toggletrue);
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

  // storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
  //   console.log('Uploaded', snapshot.totalBytes, 'bytes.');

  //   let db = firebase.firestore();
  //   let dbRef = db.collection("images").doc(file.name);

  //   let setData = dbRef.set({
  //       //yourdata here
  //       downloadURl: snapshot.downloadURL
  //   }).then( () => {
  //       console.log("Data stored in Firestore!");
  //   });
