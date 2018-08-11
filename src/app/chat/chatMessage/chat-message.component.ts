import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input() message:string="Testing";
  @Input() sentByMe:boolean=true;
  constructor() { }

  ngOnInit() {
  }

}
