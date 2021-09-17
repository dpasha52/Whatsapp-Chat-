import { Component, DoCheck, OnInit } from '@angular/core';
import { chatfilterData } from 'src/app/chatdata';
import { SharedataService } from 'src/app/common/sharedata.service';

@Component({
  selector: 'app-navright',
  templateUrl: './navright.component.html',
  styleUrls: ['./navright.component.css']
})
export class NavrightComponent implements OnInit,DoCheck{

  imgurl?:string;
  constructor( private service:SharedataService,private sharedata: SharedataService) { }
  ngDoCheck(): void {

     //this.imgurl = data.imgurl as string;
  }

  ngOnInit(): void {
    this.service.currentMessage.subscribe(data=>{
     this.imgurl = data.imgurl
    })
    this.sharedata.currevent.subscribe(dta=>{
      if(dta==false){
        this.imgurl = undefined;
      }
    })
  }

}
