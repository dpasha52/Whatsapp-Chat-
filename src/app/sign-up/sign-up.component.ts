import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { ReactiveFormsModule } from '@angular/forms';
import {User} from '@firebase/auth-types';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUPComponent implements OnInit {


  SignUpForm = new FormGroup({
    name: new FormControl('',[Validators.email,Validators.required]),
    email_or_phone: new FormControl('',[Validators.email,Validators.required]),
    password: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
  })

  constructor(private authservice:AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb:FirebaseService) { }
    ngOnInit(): void {
    }

    onSubmit(){
      console.log('this is working')

      let signedup=this.authservice.SignUp(this.SignUpForm.controls['email_or_phone'].value,this.SignUpForm.controls['password'].value)
      signedup.then(data=>
      {
        console.log(data);
        var user:Users={} as Users;
        user.name=this.SignUpForm.controls['name'].value;
        user.profilepic='https://firebasestorage.googleapis.com/v0/b/whatsappdemo-98c20.appspot.com/o/ProfilePics%2Fdefault_img.png?alt=media&token=b0358a10-18e2-403e-8fb0-22d959df1688'
        user.email=this.SignUpForm.controls['email_or_phone'].value;
        this.fb.setUser(user);
      }).catch(err=>{
        console.log(err)
      })

  }


}



