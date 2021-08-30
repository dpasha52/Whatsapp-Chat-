import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../common/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-login-or-sign-up',
  templateUrl: './login-or-sign-up.component.html',
  styleUrls: ['./login-or-sign-up.component.css']
})
export class LoginOrSignUpComponent implements OnInit {
  constructor(private authservice:AuthenticationService,
              private route: ActivatedRoute,
              private router: Router ) { }


  profileForm = new FormGroup({
    name: new FormControl('',[Validators.email,Validators.required]),
    password: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
  })

  ngOnInit(): void {
  }

  onSubmit(){

    this.authservice.SignIn(this.profileForm.controls['name'].value,this.profileForm.controls['password'].value)
    //this.authservice.CheckUserMetadata()
    this.authservice.userData.subscribe(data=>
      {
         //this.authservice.SignOut();
        if (data){
          console.log(data.email,"CHecking Email on init ")
          this.router.navigate(['app'])
        }
        else{
          this.router.navigate(['signup'])
          console.log('nothing')
        }
      })


  }

}
