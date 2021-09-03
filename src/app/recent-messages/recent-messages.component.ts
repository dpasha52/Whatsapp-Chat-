import { Component, DoCheck, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { count, take, takeLast } from 'rxjs/operators';
import { chatfilterData, Chats, UserMetaData, Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { GetrecentusersService } from '../common/getrecentusers.service';
import { SharedataService } from '../common/sharedata.service';

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
  recent_contact_list =[] as Users[];

  lastmessage!: string;

  constructor(private fb: FirebaseService, private shareData:SharedataService, private getrecentusers:GetrecentusersService,
    private authservice: AuthenticationService ) { }


  ngOnInit(): void {




    this.authservice.userData.pipe(take(1)).subscribe(cuurentUser=>{
      this.cuurentUser=cuurentUser.email;

      this.fb.getCurrentUser(this.cuurentUser).pipe(take(1)).subscribe( data=>
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
                  console.log(set, 'check the set ')

                  // .pipe(take(2))
                  let varcount =0
                  this.fb.getCombinatedChats(element.name,this.currentUsername).subscribe( chatrecords=>{
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
                    })

                })

              });

          })
    })
  }







  callFunct(currentuser: any,reciever: any,clicked:boolean, imgurl:string){
    let data:any= {
    currentuser,reciever,imgurl
    }
    this.shareData.postdata(data);

  }


}
