import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Chats, UserMetaData, Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
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
  cuurentUser!:string;
  userinfo!:Users;
  currentUsername!:string;

  @Input() toggletrue !: boolean;
  @Output() toggletrueChange = new EventEmitter();

  constructor(private fb:FirebaseService,
    private shareData:SharedataService,
    private getrecentusers:GetrecentusersService,
     private authservice:AuthenticationService) { }

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
    this.tooglefunc()
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
