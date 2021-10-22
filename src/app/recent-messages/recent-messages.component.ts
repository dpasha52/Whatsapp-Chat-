import { Component, DoCheck, OnInit } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { count, take, takeLast,first, last } from 'rxjs/operators';
import { chatfilterData, Chats, UserMetaData, Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { GetrecentusersService } from '../common/getrecentusers.service';
import { SharedataService } from '../common/sharedata.service';
import { DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
//let recent_contact_list =[] as Users[];
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
  unknown_contact_list!:Users[];
  observable!: Observable<Users[]>
  length =0;

  constructor(private fb: FirebaseService, private shareData:SharedataService, private getrecentusers:GetrecentusersService,
    private authservice: AuthenticationService,private angf:AngularFirestore, private router:Router ) {
      this.shareData.currevent.subscribe(dta=>{
        this.ngOnInit();
      })

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
          this.unknown_contact_list=[]
          //recent_contact_list =[]
          console.log("Getting current user")
          this.count++;
          console.log(this.count,"how many times")
          this.userinfo= data[0] ;

          this.currentUsername=this.userinfo.email;
          console.log(this.userinfo,"Check data recieved ")
          console.log(data[0],"Check data recieved ")

            console.log(this.userinfo.contacts,'user contacts')
              let userinfocount=0;
            if( !!this.userinfo.contacts && this.userinfo.contacts.length>0){
              this.recent_contact_list=[]
              this.unknown_contact_list=[]
              let unknown = false;
              let aq = this.getcombinedchatspercontact(this.userinfo.contacts,this.currentUsername,this.recent_contact_list,unknown)

              aq.pipe().subscribe(obs=>{
                if(obs){
                  this.recent_contact_list=obs
                  this.recent_contact_list.forEach(Element=>{
                    Element.unknown=false;
                  })
                }
              })


    //           this.userinfo.contacts.forEach( contact => {
    //             userinfocount++;
    //             console.log(userinfocount,'useinfocount')

    //             this.angf.firestore.doc(`Users/${contact}`).get().then(documntsnapshot=>{

    //               let element = documntsnapshot.data() as Users;

    //               let set = new Set();
    //               set.add(element)
    //               console.log(set, 'check the set ')
    //               if(element){
    //               // .pipe(take(2))
    //               let varcount =0
    //               this.fb.getCombinatedChats(element.email,this.currentUsername).subscribe( chatrecords=>{
    //                 varcount++
    //                 console.log(element.name,varcount,'check the set ')


    //             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                   //screwed up logic revise !!important !!! not a fix
    //             /////////////////////////////////////////////////////////////////////////////////////////////
    //               if(chatrecords.length !=0){
    //                 if(recent_contact_list.length>0){
    //                   if(!!this.recent_contact_list.find(value=>value.email==element.email)){
    //                     let len =this.recent_contact_list.indexOf(element)
    //                     this.recent_contact_list[len]=element

    //                     chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
    //                     recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
    //                     recent_contact_list[len].count=chatrecords.length;
    //                     recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
    //                   }
    //                   else{

    //                       chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
    //                       //set last message
    //                       this.lastmessage=chatrecords[chatrecords.length-1].text;
    //                       //Set Count for each user

    //                       element.count= chatrecords.length
    //                       // set last message to be seen
    //                       element.lastmessage=this.lastmessage;
    //                       element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

    //                       recent_contact_list.push(element);
    //                     }

    //                   }

    //                 else{
    //                   chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
    //                   //set last message
    //                   this.lastmessage=chatrecords[chatrecords.length-1].text;
    //                   //Set Count for each user

    //                   element.count= chatrecords.length
    //                   // set last message to be seen
    //                   element.lastmessage=this.lastmessage;
    //                   element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

    //                   recent_contact_list.push(element);
    //                 }

    //                 this.recent_contact_list=recent_contact_list.sort((a,b)=>b.time-a.time)
    //                 // if(this.recent_contact_list.includes(element)){
    //                 }
    //                 //   }

    //                 console.log(this.recent_contact_list,'check this shit')
    //               })

    //                 // function to push default chat to be loaded
    //                 // this is important but onflicting with new chat
    //                 // gets reset after click

    //                 // let chatfilter={}as chatfilterData;
    //                 // chatfilter.currentuser=this.cuurentUser
    //                 // chatfilter.reciever=this.recent_contact_list[0].name
    //                 // chatfilter.imgurl= this.recent_contact_list[0].profilepic
    //                 // this.shareData.postdata(chatfilter)

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                   console.log(this.recent_contact_list)
    //             }
    //                 })

    //               })

                }

            if( !!this.userinfo.unknowncontacts && this.userinfo.unknowncontacts.length>0){
              let unknown = true
              let aq1 = this.getcombinedchatspercontact(this.userinfo.unknowncontacts,this.currentUsername,this.unknown_contact_list,unknown)

              aq1.pipe().subscribe(obs=>{
                if(obs){
                  this.unknown_contact_list=obs
                  this.unknown_contact_list.forEach(element => {
                    element.unknown=true;
                  });
                  this.length=this.unknown_contact_list.length
                }
              })
            }

            }
          })


      })

  }
  //had to write two functions

  getcombinedchatspercontact(contacts: any[], currentUsername: string, recent_contact_list: Users[], unknown:boolean): Observable<Users[] | undefined> {
    // if(!!recent_contact_list.length){
    //   recent_contact_list[0]={ } as Users
    // }
    let bool =unknown
    let userinfocount=0;
    let aq = new Subject<Users[]>();

        contacts.forEach( contact => {
          userinfocount++;
          console.log(userinfocount,'useinfocount')

          this.angf.firestore.doc(`Users/${contact}`).get().then(documntsnapshot=>{

            let element = documntsnapshot.data() as Users;
            element.contacts

            let set = new Set();
            set.add(element)
            console.log(set, 'check the set ')
            if(element){
            // .pipe(take(2))
            let varcount =0
            this.fb.getCombinatedChats(element.email,currentUsername).subscribe( chatrecords=>{
              varcount++
              console.log(element.name,varcount,'check the set ')


              /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //screwed up logic revise !!important !!! not a fix
              /////////////////////////////////////////////////////////////////////////////////////////////
                if(chatrecords.length !=0){
                  if(recent_contact_list && recent_contact_list.length>0){
                    if(!!recent_contact_list.find(value=>value.email==element.email)){
                      let len =recent_contact_list.indexOf(element)
                      recent_contact_list[len]=element

                      chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
                      recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
                      recent_contact_list[len].count=chatrecords.length;
                      recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
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

                  recent_contact_list=recent_contact_list.sort((a,b)=>b.time-a.time)
                    aq.next(recent_contact_list);
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
                //console.log(this.recent_contact_list)
          }
              })

        })
          return aq.asObservable();
  }

  //for emergencies

  // getcombinedchatspercontact1(contacts: any[], currentUsername: string, recent_contact_list: Users[], unknown:boolean): Observable<Users[] | undefined> {
  //   // if(!!recent_contact_list.length){
  //   //   recent_contact_list[0]={ } as Users
  //   // }
  //   let bool =unknown
  //   let userinfocount=0;
  //   let aq1 = new Subject<Users[]>();
  //       contacts.forEach( contact => {
  //         userinfocount++;
  //         console.log(userinfocount,'useinfocount')

  //         this.angf.firestore.doc(`Users/${contact}`).get().then(documntsnapshot=>{

  //           let element = documntsnapshot.data() as Users;
  //           element.contacts

  //           let set = new Set();
  //           set.add(element)
  //           console.log(set, 'check the set ')
  //           if(element){
  //           // .pipe(take(2))
  //           let varcount =0
  //           this.fb.getCombinatedChats(element.email,currentUsername).subscribe( chatrecords=>{
  //             varcount++
  //             console.log(element.name,varcount,'check the set ')


  //             /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                   //screwed up logic revise !!important !!! not a fix
  //             /////////////////////////////////////////////////////////////////////////////////////////////
  //               if(chatrecords.length !=0){
  //                 if(recent_contact_list && recent_contact_list.length>0){
  //                   if(!!recent_contact_list.find(value=>value.email==element.email)){
  //                     let len =recent_contact_list.indexOf(element)
  //                     recent_contact_list[len]=element

  //                     chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
  //                     recent_contact_list[len].time=chatrecords[chatrecords.length-1].timestamp.toDate();
  //                     recent_contact_list[len].count=chatrecords.length;
  //                     recent_contact_list[len].lastmessage=chatrecords[chatrecords.length-1].text;
  //                   }
  //                   else{

  //                       chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
  //                       //set last message
  //                       this.lastmessage=chatrecords[chatrecords.length-1].text;
  //                       //Set Count for each user

  //                       element.count= chatrecords.length
  //                       // set last message to be seen
  //                       element.lastmessage=this.lastmessage;
  //                       element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

  //                       recent_contact_list.push(element);
  //                     }

  //                   }

  //                 else{
  //                   chatrecords.sort((a,b)=>a.timestamp-b.timestamp)
  //                   //set last message
  //                   this.lastmessage=chatrecords[chatrecords.length-1].text;
  //                   //Set Count for each user

  //                   element.count= chatrecords.length
  //                   // set last message to be seen
  //                   element.lastmessage=this.lastmessage;
  //                   element.time=chatrecords[chatrecords.length-1].timestamp.toDate();

  //                   recent_contact_list.push(element);
  //                 }

  //                 recent_contact_list=recent_contact_list.sort((a,b)=>b.time-a.time)
  //                  aq1.next(recent_contact_list);

  //                 // if(this.recent_contact_list.includes(element)){
  //                 }
  //                 //   }

  //                 console.log(this.recent_contact_list,'check this shit')
  //           })

  //             // function to push default chat to be loaded
  //             // this is important but onflicting with new chat
  //             // gets reset after click

  //             // let chatfilter={}as chatfilterData;
  //             // chatfilter.currentuser=this.cuurentUser
  //             // chatfilter.reciever=this.recent_contact_list[0].name
  //             // chatfilter.imgurl= this.recent_contact_list[0].profilepic
  //             // this.shareData.postdata(chatfilter)

  //   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //               //console.log(this.recent_contact_list)
  //         }
  //             })

  //       })
  //         return aq1.asObservable();
  // }


  callFunct(currentuser: any,reciever: any, unknown:boolean, imgurl:string,uname:string){
    let data:any= {
    currentuser,reciever,imgurl,uname,unknown
    }
    this.shareData.postdata(data);
    this.shareData.currmobsrc.subscribe(dta=>{
      if(dta){
        this.router.navigate(['m/chats'])
      }
    })

  }

}

