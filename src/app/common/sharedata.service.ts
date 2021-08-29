import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {

  constructor() { }
  data:any;



  postData(input:any){
    //console.log("recieved input data")
    this.data = input;
    //console.log("this.data:",this.data)
  }

  recieveData(){
    if(this.data){
      console.log("Returning recieved data ")
      return this.data;
    }
    else{
      return null;
    }
  }
}
