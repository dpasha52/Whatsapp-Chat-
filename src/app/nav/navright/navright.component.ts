import { Component, DoCheck, OnInit } from '@angular/core';
import { SharedataService } from 'src/app/common/sharedata.service';

@Component({
  selector: 'app-navright',
  templateUrl: './navright.component.html',
  styleUrls: ['./navright.component.css']
})
export class NavrightComponent implements OnInit,DoCheck{

  imgurl!:string;
  constructor( private service:SharedataService) { }
  ngDoCheck(): void {
    let data:any=this.service.recieveData();
     this.imgurl = data.imgurl as string;
  }

  ngOnInit(): void {
    let data:any=this.service.recieveData();
     this.imgurl = data.imgurl as string;
  }

}
