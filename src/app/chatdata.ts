import { Timestamp } from "rxjs";


export interface Chats{
  from:string,
  text:string,
  timestamp:any,
  to:string
}

export interface Users{
  name:string,
  messageIds:string[],
  contacts:string[],
  lastmessage?:string,
  time?:any,
  count:number,
  profilepic:string
}


export interface UserMetaData{
  lastmessage:string,
  time:any
}

export interface chatfilterData{
  currentuser:string,
  reciever:string
}
