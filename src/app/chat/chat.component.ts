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
  fromUser: chatUser = { Name: this.GlobalVariables.getUserName(), chatId: '', messages: [] }; //the user currently logged in
  toUser: chatUser = { Name: '', chatId: '', messages: [] }; //the user to whom message needs to be sent 
  onlineUsers: chatUser[] = [];   //Holds the current Online users.
  chats: chatMessageModel[] = []; //gives the messages according to the selected 'toUser'
  userMessage: chatMessageModel = { message: '', sentBy: true } //user entred message is bing to this model.

  selectedUser:Number;

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


      //fetch the current online users on success full login to the chat app.
      this.chatService.getOnlineUsers().subscribe((user) => {
        user.forEach(element => {
          const usr: chatUser = { Name: element.Name, chatId: element.ChatId, messages: [] }
          if (usr.chatId != this.fromUser.chatId)
            this.onlineUsers.push(usr);
        });
        this.PrintOnlineUsers();
      });

    });

    //on receiveing the chat from the server
    this.socket.on('get message', function (obj) {
      console.log("This is from Get Message (Backend):" + "message=" + obj.message + "to=" + obj.from);
      var userMessageReceived: chatMessageModel = { message: obj.message, sentBy: false };
      console.log("USer Message Recived " + JSON.stringify(userMessageReceived));

      console.log("Online Users when message received:" + JSON.stringify(this.onlineUsers));

      //Push the messages to the respective online users in the receivers's UI
      const indexOfSelectedUser = this.onlineUsers.findIndex(x => x.chatId == obj.from);
      if (indexOfSelectedUser >= 0)
        this.onlineUsers[indexOfSelectedUser].messages.push(userMessageReceived);
    }.bind(this));

    //this will be trigerred when a new users log in to the chat , and online users list needs to be updated.
    this.socket.on('NewUser', function (msg) {
      console.log("NewUser :" + msg);
      this.chatService.getOnlineUsers().subscribe((newUser) => {
        newUser.forEach(element => {
          var usr: chatUser = { Name: element.Name, chatId: element.ChatId, messages: [] }
          if (usr.chatId != this.fromUser.chatId && this.onlineUsers.every((x) => { return x.chatId != usr.chatId }))
            this.onlineUsers.push(usr);
        });
        console.log("Onlien users after NewUser Event :");
        this.PrintOnlineUsers();
      });
    }.bind(this))

    //this will be trigerred when a user disconnects from the chat, disconnected users socket id received as message
    //splice the user having the this scoket id from the online users list.
    this.socket.on('UserDisconnected', function (disconnectedSocket) {
      console.log("disconnectedSocket :" + disconnectedSocket);
      this.onlineUsers.splice(this.onlineUsers.findIndex(x => x.chatId == disconnectedSocket), 1);
      console.log("Onlien users after UserDisconnected Event :");
      this.PrintOnlineUsers();
    }.bind(this))
  }

  PrintOnlineUsers() {
    console.log("Online USers Now:");
    console.log(JSON.stringify(this.onlineUsers));
  }

  InsertMessage() {
    const userMessageNew: chatMessageModel = Object.assign({}, this.userMessage);
    const indexOfSelectedUser = this.onlineUsers.findIndex(x => x.chatId == this.toUser.chatId);
    //Insert message to the senders UI on clicking the Sent Button
    this.onlineUsers[indexOfSelectedUser].messages.push(userMessageNew);
    console.log("Online Users Object after message inserted");
    console.log(JSON.stringify(this.onlineUsers));
    var obj: any = {};
    obj.message = userMessageNew.message;
    obj.to = this.toUser.chatId; 
    obj.from = this.fromUser.chatId;

    //send the message to the receier.
    this.socket.emit('chat message', obj);
  }
  sendMessage() {


  }
  selectChat(user: chatUser) {
    this.toUser = user;
    console.log("Selected USer :" + JSON.stringify(this.toUser));
    this.chats = this.onlineUsers[this.onlineUsers.findIndex(x => x.chatId == user.chatId)].messages;
  }

  setClickedUser(index)
  {
    this.selectedUser = index;
    console.log("Index of Selected : "+index);
  }

}
