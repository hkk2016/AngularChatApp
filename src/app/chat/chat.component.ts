import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import { chatUser } from '../models/chatUser.model';
import { OnlineUserComponent } from './chatOnlineUsers/online-user.component';
import { ChatMessageComponent } from './chatMessage/chat-message.component';
import { chatMessageModel } from '../models/chatMessage.model';
import { GlobalVariablesService } from '../login/loginService/global-variables.service';
import { JsonPipe } from '../../../node_modules/@angular/common';
import { ChatService } from './chatService/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private GlobalVariables: GlobalVariablesService,
    private chatService: ChatService) { }
  title = 'app';
  fromUser: chatUser = { Name: this.GlobalVariables.getUserName(), chatId: '', messages: [] };
  toUser: chatUser = { Name: '', chatId: '', messages: [] };
  onlineUsers: chatUser[] = [];

  // {Name:'Hari',chatId:'1',messages:[{message:'1',sentBy:true},{message:'2',sentBy:false},{message:'3',sentBy:true},{message:'4',sentBy:false},{message:'5',sentBy:false}]},
  // {Name:'Sudhi',chatId:'2',messages:[{message:'3',sentBy:true},{message:'4',sentBy:false}]},
  // {Name:'Ammi',chatId:'3',messages:[{message:'5',sentBy:true},{message:'6',sentBy:false}]},
  // {Name:'Ashitha',chatId:'4',messages:[{message:'7',sentBy:true},{message:'8',sentBy:false}]},
  // {Name:'Hareesh',chatId:'5',messages:[{message:'9',sentBy:true},{message:'10',sentBy:false}]}

  chats: chatMessageModel[] = [];
  userMessage: chatMessageModel = { message: '', sentBy: true }
  // socket = io('http://localhost:3000');
  socket: any;
  ngOnInit() {

    this.socket = io.connect('http://localhost:3000', { query: 'Name=' + this.fromUser.Name + '' });
    this.socket.on('connect', () => {
      console.log(this.socket);
      console.log(this.socket.id);
      this.fromUser.chatId = this.socket.id;
      console.log("FromUser:");
      console.log(JSON.stringify(this.fromUser));
      //console.log("Online USers:");

      this.chatService.getOnlineUsers().subscribe((user) => {
        user.forEach(element => {
          const usr: chatUser = { Name: element.Name, chatId: element.ChatId, messages: [] }
          //console.log(JSON.stringify(usr));
          if (usr.chatId != this.fromUser.chatId)
            this.onlineUsers.push(usr);
          // console.log("Online USers On each Push:");
          // console.log(JSON.stringify(this.onlineUsers));
        });
        this.PrintOnlineUsers();
      });






    });

    // console.log("socket.io.engine.id="+this.socket.io.engine.id)
    // console.log("Global from Chat "+this.GlobalVariables.getUserName());

    this.socket.on('get message', function (obj) {
      console.log("This is from Get Message (Backend):" + "message=" + obj.message + "to=" + obj.from);
      var userMessageReceived: chatMessageModel = { message: obj.message, sentBy: false };
      console.log("USer Message Recived " + JSON.stringify(userMessageReceived));

      console.log("Online Users when message received:" + JSON.stringify(this.onlineUsers));
      const indexOfSelectedUser = this.onlineUsers.findIndex(x => x.chatId == obj.from);
      if (indexOfSelectedUser >= 0)
        this.onlineUsers[indexOfSelectedUser].messages.push(userMessageReceived);
    }.bind(this));

    this.socket.on('NewUser', function (msg) {
      console.log("NewUser :"+msg);
      this.chatService.getOnlineUsers().subscribe((newUser) => {
        newUser.forEach(element => {
          var usr: chatUser = { Name: element.Name, chatId: element.ChatId, messages: [] }
          //console.log(JSON.stringify(usr));
          if (usr.chatId != this.fromUser.chatId && this.onlineUsers.every((x)=>{return x.chatId!=usr.chatId}))
            this.onlineUsers.push(usr);
            
          // console.log("Online USers On each Push:");
          // console.log(JSON.stringify(this.onlineUsers));
        });
        console.log("Onlien users after NewUser Event :");
        this.PrintOnlineUsers();
      });
    }.bind(this))

    this.socket.on('UserDisconnected', function (disconnectedSocket) {
      console.log("disconnectedSocket :"+disconnectedSocket);
      this.onlineUsers.splice(this.onlineUsers.findIndex(x=>x.chatId==disconnectedSocket),1);
      console.log("Onlien users after UserDisconnected Event :");
      this.PrintOnlineUsers();
    }.bind(this))



    //   this.socket.on('connection',function(mysocket)
    // {
    //   mysocket.on('get message',function(message){
    //     console.log("This is from Get Message :"+message);
    // })

    // });
    // this.InsertMessage(message);
    // }.bind(this))
  }
  //  display(obj) {
  //   console.log(obj.Name);

  // }
  PrintOnlineUsers() {
    console.log("Online USers New:");
    console.log(JSON.stringify(this.onlineUsers));
  }

  InsertMessage() {
    //this.chats.push(this.userMessage);
    const userMessageNew: chatMessageModel = Object.assign({}, this.userMessage);
    const indexOfSelectedUser = this.onlineUsers.findIndex(x => x.chatId == this.toUser.chatId);
    this.onlineUsers[indexOfSelectedUser].messages.push(userMessageNew);
    console.log("Online Users Object after message inserted");
    console.log(JSON.stringify(this.onlineUsers));
    var obj: any = {};
    obj.message = userMessageNew.message;
    obj.to = this.toUser.chatId; //obj.chatId = this.toUser.chatId;
    obj.from=this.fromUser.chatId;
    //obj.chatId = this.fromUser.chatId;
    this.socket.emit('chat message', obj);


  }
  sendMessage() {


  }
  selectChat(user: chatUser) {
    this.toUser = user;
    console.log("Selected USer :" + JSON.stringify(this.toUser));
    //this.onlineUsers.findIndex(x=>x.Name==user.Name)
    this.chats = this.onlineUsers[this.onlineUsers.findIndex(x => x.chatId == user.chatId)].messages;
    //console.log(this.onlineUsers.findIndex(x=>x.Name=='Ammi'))

  }

}
