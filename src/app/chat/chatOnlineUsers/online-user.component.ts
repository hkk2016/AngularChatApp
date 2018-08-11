import { Component, OnInit ,Input} from '@angular/core';
import { chatUser } from '../../models/chatUser.model';

@Component({
  selector: 'app-online-user',
  templateUrl: './online-user.component.html',
  styleUrls: ['./online-user.component.css']
})
export class OnlineUserComponent implements OnInit {

  @Input() onlineUser:chatUser;
  constructor() { }

  ngOnInit() {
  }

}
