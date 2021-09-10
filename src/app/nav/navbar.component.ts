import { EventEmitter, Component, Input, OnInit, Output, OnChanges, AfterViewInit } from '@angular/core';
import { Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  toggleflag: boolean = true;
  hasLoaded:boolean = true;
  CurrentUserEmail!:string;
  CurrentUserData!:Users;


  constructor(private fb:FirebaseService, private authservice:AuthenticationService) { }

  ngOnInit(): void {
    console.log( 'app component',this.toggleflag)
    this.toggleflag = true
    this.authservice.userData.subscribe(userinfo=>
        this.CurrentUserEmail=userinfo.email
    )
    if(this.CurrentUserEmail){
      this.fb.getCurrentUser(this.CurrentUserEmail).subscribe(data=>
        this.CurrentUserData=data[0])

    }

  }


}
