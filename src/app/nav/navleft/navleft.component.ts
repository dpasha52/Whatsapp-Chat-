import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from 'src/app/chatdata';
import { AuthenticationService } from 'src/app/common/authentication.service';
import { FirebaseService } from 'src/app/common/firebase.service';


@Component({
  selector: 'app-navleft',
  templateUrl: './navleft.component.html',
  styleUrls: ['./navleft.component.css']
})
export class NavleftComponent implements OnInit {
  @Input() toggletrue !: boolean;
  @Output() toggletrueChange = new EventEmitter();
  @Output() finishedLoading: EventEmitter<boolean>= new EventEmitter<boolean>();
  data: any;
  imgsrc!:string
  constructor(private fb:FirebaseService,private authservice:AuthenticationService) { }

  ngOnInit(): void {
    this.getCurrentUserData();
  }

  openNewMessageComponent(){
    this.toggletrue= !this.toggletrue;
    this.toggletrueChange.emit(this.toggletrue);
    console.log(this.toggletrue);
  }

  ngAfterViewChecked() {
    // you could also do this after a service call of some sort
    this.finishedLoading.emit(true);
 }
getCurrentUserData()
{


  this.authservice.userData.subscribe(data=>
    {
      if (data){

        this.fb.getCurrentUser(data.email).subscribe(data=> {
          this.data = data[0];
          if(!! this.data.profilepic){
           this.imgsrc=this.data.profilepic
         }
        });
      }
    })


  // this.data = this.data as Users;
  // if(!!this.data.profilepic){

  // }
  // if(typeof this.data.profilepic === 'string'){
  //   this.imgsrc=this.data.profilepic
  // }
}

}
