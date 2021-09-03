import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { chatfilterData } from '../chatdata';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {

    data:chatfilterData={} as chatfilterData
    private messageSource = new BehaviorSubject(this.data);
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    postdata(message: any) {
      this.messageSource.next(message)
    }

}
