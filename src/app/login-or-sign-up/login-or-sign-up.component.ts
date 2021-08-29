import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../common/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login-or-sign-up',
  templateUrl: './login-or-sign-up.component.html',
  styleUrls: ['./login-or-sign-up.component.css']
})
export class LoginOrSignUpComponent implements OnInit {
  constructor(private authservice:AuthenticationService) { }


  profileForm = new FormGroup({
    name: new FormControl('',[Validators.email,Validators.required]),
    password: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
  })

  ngOnInit(): void {
  }

  onSubmit(){
    this.authservice.SignIn(this.profileForm.controls['name'].value,this.profileForm.controls['password'].value)
    console.log("on submit")
    console.log(this.profileForm.value);
  }

}
