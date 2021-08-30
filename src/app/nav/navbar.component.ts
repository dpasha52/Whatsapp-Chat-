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
  hasLoaded:boolean = false;
  CurrentUserEmail!:string;
  CurrentUserData!:Users;


  constructor(private fb:FirebaseService, private authservice:AuthenticationService) { }

  ngOnInit(): void {
    console.log( 'app component',this.toggleflag)

    this.authservice.userData.subscribe(userinfo=>
        this.CurrentUserEmail=userinfo.email
    )

    this.fb.getCurrentUser(this.CurrentUserEmail).subscribe(data=>
        this.CurrentUserData=data[0])

    this.loadContacts();






  }
  loadContacts(){
    //parse all users and check if their contacts has your email id

    // logic
    //
    // hard code list of contacts
    // hard_contacts
    //  foreach hard_contact with id {
    //
    //  }
    //
    //
    //from all users
  }


}
