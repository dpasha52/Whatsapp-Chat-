import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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
  // clickcount:number=0
  // obs!: Users[] | Observable<unknown[]>;
  // chats!: Chats[];
  // usersonInit!:Users[];
  // users_recent!:Users[];
  // usermetadata:UserMetaData[]=[];
  // color:any;
  cuurentUser!:string;
  userinfo!:Users;
  currentUsername!:string;
  contact_list=[] as Users[];
  recent_contact_list =[] as Users[];
  @Input() toggletrue !: boolean;
  @Output() toggletrueChange = new EventEmitter();
  count!: number;
  lastmessage!: string;

  constructor(private fb:FirebaseService,
    private shareData:SharedataService,
    private getrecentusers:GetrecentusersService,
     private authservice:AuthenticationService) { }


     demofunc(){
      // console.log('part3 user on init', this.usersonInit)
     }

    functSortByChat(contact: Users, username:string) {
        // getting chats for each user
        this.fb.getCombinatedChats(contact.name,username).subscribe( chatrecords=>{
        //updating "last seen" "last message" and "username" for sorted userlist
      //    this.count= chatrecords.length

          //sort list by timestamp to get last seen
          chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
          //set last message
          let lastmessage=chatrecords[chatrecords.length-1].text;
          //Set Count for each user

          contact.count = chatrecords.length
          // set last message to be seen
          contact.lastmessage=lastmessage;
          contact.time=chatrecords[chatrecords.length-1].timestamp.toDate();
          this.recent_contact_list.push(contact);
        })

      //this.fb.getChats()
    }


 ngOnInit(): void {
    this.recent_contact_list=[]
    console.log("Im in Oninit of recent chat");
    // .pipe(take(1))
            this.authservice.userData.subscribe(cuurentUser=>{
              this.cuurentUser=cuurentUser.email;
              // .pipe(take(1))
              this.fb.getCurrentUser(this.cuurentUser).subscribe( data=>
              {

                  console.log("Getting current user")
                  this.count++;
                  console.log(this.count,"how many times")
                  this.userinfo= data[0] ;

                  this.currentUsername=this.userinfo.name;
                  console.log(this.userinfo,"Check data recieved ")
                  console.log(data[0],"Check data recieved ")

                    console.log(this.userinfo.contacts,'user contacts')
                      let userinfocount=0;

                      this.userinfo.contacts.forEach( contact => {
                        userinfocount++;
                        console.log(userinfocount,'useinfocount')

                        contact.get().then((documntsnapshot: { data: () => Users; })=>{


                          let element = documntsnapshot.data() as Users;

                          let set = new Set();
                          set.add(element)
                          this.contact_list.push(element)
                          console.log(set, 'check the set ')
                          this.contact_list.sort((a,b)=>{
                            if(a.name >b.name ){
                              return 1;
                            }
                            if(a.name < b.name){
                              return -1;
                            }
                            else{
                              return 0;
                            }
                          })
                          let varcount =0
                          this.fb.getCombinatedChats(element.name,this.currentUsername).pipe(take(2)).subscribe( chatrecords=>{
                            varcount++
                            console.log( element.name,varcount,'check the set ')


                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                              //screwed up logic revise !!important !!! not a fix
                        /////////////////////////////////////////////////////////////////////////////////////////////

                          if(this.recent_contact_list.includes(element)){
                            let len =this.recent_contact_list.indexOf(element)
                                this.recent_contact_list[len]=element

                              chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                              this.recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
                              this.recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
                              this.recent_contact_list[len].count=chatrecords.length;
                              this.recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
                            } else{

                              chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                              //set last message
                              this.lastmessage=chatrecords[chatrecords.length-1].text;
                              //Set Count for each user

                              element.count= chatrecords.length
                              // set last message to be seen
                              element.lastmessage=this.lastmessage;
                              element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

                              this.recent_contact_list.push(element);
                            }
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            this.recent_contact_list.sort((a,b)=>b.count - a.count)
                            console.log(this.recent_contact_list)
                            })




                        })


                      });



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
    this.shareData.postdata(data);
    this.tooglefunc()
    if(clicked){
      //this.clickcount++
    }

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
