import { Component, DoCheck, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { count, take, takeLast,first } from 'rxjs/operators';
import { chatfilterData, Chats, UserMetaData, Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { GetrecentusersService } from '../common/getrecentusers.service';
import { SharedataService } from '../common/sharedata.service';
import { DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
let recent_contact_list =[] as Users[];
@Component({
  selector: 'app-recent-messages',
  templateUrl: './recent-messages.component.html',
  styleUrls: ['./recent-messages.component.css']
})

export class RecentMessagesComponent implements OnInit {
  count =0;
  cuurentUser!:string;
  userinfo!:Users;
  currentUsername!:string;
  contact_list=[] as Users[];

  docrefid=[] as string[];

  lastmessage!: string;
  recent_contact_list!: Users[];
  observable!: Observable<Users[]>

  constructor(private fb: FirebaseService, private shareData:SharedataService, private getrecentusers:GetrecentusersService,
    private authservice: AuthenticationService,private angf:AngularFirestore ) {
      // this.shareData.currevent.subscribe(dta=>{
      //   this.ngOnInit();
      // })

    }


   ngOnInit(): void {

    this.authservice.userData.pipe(first()).subscribe(cuurentUser=>{
      this.cuurentUser=cuurentUser.email;

      //
      //Subscribe called multiple times needs a fix
      //.pipe(take(1))
      this.fb.getCurrentUser(this.cuurentUser).pipe(first()).subscribe( data=>
      {
        if(data.length>0){
          this.recent_contact_list=[]
          recent_contact_list =[]
          console.log("Getting current user")
          this.count++;
          console.log(this.count,"how many times")
          this.userinfo= data[0] ;

          this.currentUsername=this.userinfo.email;
          console.log(this.userinfo,"Check data recieved ")
          console.log(data[0],"Check data recieved ")

            console.log(this.userinfo.contacts,'user contacts')
              let userinfocount=0;
            if(this.userinfo.contacts.length>0){
              this.userinfo.contacts.forEach( contact => {
                userinfocount++;
                console.log(userinfocount,'useinfocount')

                this.angf.firestore.doc(`Users/${contact}`).get().then(documntsnapshot=>{

                  let element = documntsnapshot.data() as Users;

                  let set = new Set();
                  set.add(element)
                  console.log(set, 'check the set ')
                  if(element){
                  // .pipe(take(2))
                  let varcount =0
                  this.fb.getCombinatedChats(element.email,this.currentUsername).subscribe( chatrecords=>{
                    varcount++
                    console.log(element.name,varcount,'check the set ')


                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      //screwed up logic revise !!important !!! not a fix
                /////////////////////////////////////////////////////////////////////////////////////////////
                  if(chatrecords.length !=0){
                    if(recent_contact_list.length>0){
                      if(!!this.recent_contact_list.find(value=>value.email==element.email)){
                        let len =this.recent_contact_list.indexOf(element)
                        this.recent_contact_list[len]=element

                      chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                      recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
                      recent_contact_list[len].count=chatrecords.length;
                      recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
                      }

                      // recent_contact_list.forEach(contact => {
                      //   if(contact.email == element.email){
                      //     let len =this.recent_contact_list.indexOf(element)
                      //     this.recent_contact_list[len]=element

                      //   chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                      //   recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
                      //   recent_contact_list[len].count=chatrecords.length;
                      //   recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
                      //   }
                        else{

                          chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                          //set last message
                          this.lastmessage=chatrecords[chatrecords.length-1].text;
                          //Set Count for each user

                          element.count= chatrecords.length
                          // set last message to be seen
                          element.lastmessage=this.lastmessage;
                          element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

                          recent_contact_list.push(element);
                        }

                      }

                    else{
                      chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                      //set last message
                      this.lastmessage=chatrecords[chatrecords.length-1].text;
                      //Set Count for each user

                      element.count= chatrecords.length
                      // set last message to be seen
                      element.lastmessage=this.lastmessage;
                      element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

                      recent_contact_list.push(element);
                    }

                    this.recent_contact_list=recent_contact_list.sort((a,b)=>b.count-a.count)
                    // if(this.recent_contact_list.includes(element)){
                    }
                    //   }

                    console.log(this.recent_contact_list,'check this shit')
                  })

                    // function to push default chat to be loaded
                    // this is important but onflicting with new chat
                    // gets reset after click

                    // let chatfilter={}as chatfilterData;
                    // chatfilter.currentuser=this.cuurentUser
                    // chatfilter.reciever=this.recent_contact_list[0].name
                    // chatfilter.imgurl= this.recent_contact_list[0].profilepic
                    // this.shareData.postdata(chatfilter)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      console.log(this.recent_contact_list)
                }
                    })

                  })

                }

              }
            })


      })

  }



  callFunct(currentuser: any,reciever: any,clicked:boolean, imgurl:string,uname:string){
    let data:any= {
    currentuser,reciever,imgurl,uname
    }
    this.shareData.postdata(data);

  }

}

