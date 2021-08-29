import { EventEmitter, Component, Input, OnInit, Output, OnChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  toggleflag: boolean = true;
  hasLoaded:boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log( 'app component',this.toggleflag)
  }

}
