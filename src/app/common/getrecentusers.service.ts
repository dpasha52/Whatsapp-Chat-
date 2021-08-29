import { Injectable } from '@angular/core';
import { Chats, UserMetaData, Users } from '../chatdata';

@Injectable({
  providedIn: 'root'
})
export class GetrecentusersService {

  constructor() { }


getLastMessageReturnActiveUsers(model:{users:Users[];chats:Chats[];usermetadata:UserMetaData[]}){
  let userArray:Users[]=[]
  let count = 0;

  model.users.forEach(user => {
    let array:Chats[]= []
    model.chats.forEach(chat => {
      if((chat.to == 'dpasha52' && chat.from==user.name)
            || (chat.from == 'dpasha52' && chat.to==user.name))
            {
              if((chat.from == 'dpasha52' && chat.to==user.name))
              {
                count++
              }
              array.push(chat);

            }
    });
  if(array.length > 0){
    let lastmessage = array[array.length-1].text as string;

    var maximumDate = array.map(val=>val.timestamp)  ;
    console.log(maximumDate[maximumDate.length-1]);

    maximumDate.sort((a,b) => {
      return a - b
    })

    let time = maximumDate[maximumDate.length-1].toDate() as Date;

    if(!!lastmessage && !!time){
      user.lastmessage=lastmessage;
      user.time=time;
      user.count= count;
    }

    if(count > 0){
      userArray.push(user);
      console.log(model.usermetadata)
    }
    count=0;
  }
  });
  return userArray;
}

}
