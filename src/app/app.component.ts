import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './common/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fb:FirebaseService, private rout:Router ){}
  title = 'WhatsappDemo2';

  ngOnInit(): void{

    // this.fb.getChats();
    // this.fb.getUsers();
  }

}
