import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from 'src/app/chatdata';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { FirebaseService } from 'src/app/common/firebase.service';
import { SharedataService } from 'src/app/common/sharedata.service';



@Component({
  selector: 'app-navleft',
  templateUrl: './navleft.component.html',
  styleUrls: ['./navleft.component.css']
})
export class NavleftComponent implements OnInit {
  togglevar:boolean = true;

  @Input() toggletrue !: boolean;
  @Output() toggletrueChange = new EventEmitter();
  @Output() finishedLoading: EventEmitter<boolean>= new EventEmitter<boolean>();
  data: any;
  imgsrc!:string
  constructor(private fb:FirebaseService,private authservice:AuthenticationService,
              private router:Router,private activeroute:ActivatedRoute,private share:SharedataService) { }

  ngOnInit(): void {
    this.getCurrentUserData();
    console.log(this.data,"data recieved from firebase")
  }

  async openNewMessageComponent(){
    this.toggletrue= !this.toggletrue;
    this.toggletrueChange.emit(this.toggletrue);
    console.log(this.toggletrue);
    this.share.currmobsrc.subscribe(dta=>{
      if(dta){
        this.router.navigate(['m/contacts'])
      }
    })
  }



 getCurrentUserData()
 {
   this.authservice.userData.subscribe(data=>
    {
      if (data){

        this.fb.getCurrentUser(data.email).subscribe(data=> {
         if(data.length>0){

          this.data = data[0];
           this.imgsrc=this.data.profilepic;
         }
        });
      }
    })
}

navigatefunc(){
  this.router.navigate(['/updateprofile'])
}

}
