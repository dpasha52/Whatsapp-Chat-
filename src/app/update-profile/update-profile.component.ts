import { Component, OnChanges, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@firebase/auth-types';
import { Users } from '../chatdata';
import { AuthenticationService } from '../common/authentication.service';
import { FirebaseService } from '../common/firebase.service';
import { getAuth, updateProfile } from "firebase/auth";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, takeLast } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as myGlobals from '../global'
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user:User={} as User;
  userinfo:Users={} as Users;
  button_writable = true
  currentuseremail: any;
  imgsrc!:string;
  file!:File;
  downloadURL?: Observable<string>;

  constructor(private authservice:AuthenticationService,private fb:FirebaseService,
       private ngfs:AngularFireStorage,private router:Router
      ) { }




  profileForm = new FormGroup({
    name:  new FormControl('',[Validators.email,Validators.required]),
    email: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required]),
    about: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required]),
    imagefile: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
  });


  ngOnInit():void {

    this.authservice.userData.subscribe(currentuser=>{
      this.currentuseremail=currentuser.email;
          this.fb.getCurrentUser(this.currentuseremail).subscribe(
              data=>{
                        this.userinfo=data[0];
                        this.userinfo.customID=data[0].customID;

                        console.log(data[0],'chaecking for populated id')
                        console.log(this.userinfo,'chaecking for populated id')

                        this.profileForm = new FormGroup({
                          name:  new FormControl(this.userinfo.name,[Validators.email,Validators.required]),
                          email: new FormControl(this.userinfo.email,[Validators.pattern('[a-zA-Z ]*'),Validators.required]),
                          about: new FormControl(this.userinfo.about,[Validators.pattern('[a-zA-Z ]*'),Validators.required]),
                          imagefile: new FormControl('',[Validators.pattern('[a-zA-Z ]*'),Validators.required])
                        });
                        this.imgsrc=this.userinfo.profilepic;
                    }
              )
    })

  }


  onSubmit(){
    let delimg=true
    //logic to leave out default image
    // let existing_url= this.userinfo.profilepic
    // if(existing_url == myGlobals.defalut_url){
    //   delimg= false
    // }


    if(!!this.file){

          let ref=`ProfilePics/${this.userinfo.email}`
          let  task = this.ngfs.upload(ref,this.file);
              const varfile = this.ngfs.ref(ref);
            task.snapshotChanges().pipe(
              finalize(() => {
                varfile.getDownloadURL().subscribe((url) => {
                  this.userinfo.profilepic = url
                  this.saveData();
                });
              })
            ).subscribe();
    } else {
      this.saveData()
    }
  }

  saveData() {
    this.userinfo.about= this.profileForm.controls['about'].value;
    this.userinfo.name= this.profileForm.controls['name'].value;
      /////////////////////
      //add email logic later
      // stub here
      //this.userinfo.email= this.profileForm.controls['email'].value
      /////////////////////
    this.fb.updateUserInfo(this.userinfo.customID,this.userinfo)
    this.router.navigate(['app']);

  }

  changefile(event:any){

     this.file=event.target.files[0];
     var reader = new FileReader();

     reader.onload = (event: any) => {
       this.imgsrc = event.target.result;
     };

    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(event.target.files[0]);
  }


}


