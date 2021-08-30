import { Timestamp } from "rxjs";


export interface Chats{
  from:string,
  text:string,
  timestamp:any,
  to:string
}

export interface Users{
  name:string,
  //messageIds:string[],
  contacts:string[],
  lastmessage?:string,
  time?:any,
  count:number,
  profilepic:string,
  email:string,
  phonenumber:string
}


export interface UserMetaData{
  lastmessage:string,
  time:any
}

export interface chatfilterData{
  currentuser:string,
  reciever:string
}

//for later

// <nav class="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar">
//     <div class="container">
//       <a class="navbar-brand" href="#">
//         <strong>MDB</strong>
//       </a>
//       <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-7" aria-controls="navbarSupportedContent-7" aria-expanded="false" aria-label="Toggle navigation">
//         <span class="navbar-toggler-icon"></span>
//       </button>
//       <div class="collapse navbar-collapse" id="navbarSupportedContent-7">
//         <ul class="navbar-nav mr-auto">
//           <li class="nav-item active">
//             <a class="nav-link" href="#">Home
//               <span class="sr-only">(current)</span>
//             </a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Link</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Profile</a>
//           </li>
//         </ul>
//         <form class="form-inline">
//           <div class="md-form mt-0">
//             <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
//           </div>
//         </form>
//       </div>
//     </div>
//   </nav>
