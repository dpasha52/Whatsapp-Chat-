import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { chatfilterData } from '../chatdata';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {


    event:any ={1:1};
    private eventsrc =new BehaviorSubject(this.event)
    currevent = this.eventsrc.asObservable();

    data:chatfilterData={} as chatfilterData
    private messageSource = new BehaviorSubject(this.data);
    currentMessage = this.messageSource.asObservable();

    mobile:boolean = false
    private mobsrc = new BehaviorSubject(this.mobile);
    currmobsrc = this.mobsrc.asObservable();


    constructor() { }

    postdata(message: any) {
      this.messageSource.next(message)
    }

    postevent(dta:any){
      this.eventsrc.next(dta);
    }

    postMobtrue(dta:boolean){
      this.mobsrc.next(dta);
    }

}
