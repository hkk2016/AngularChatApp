import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  myPhoto:string="../../assets/about/Hari.jpeg";
  constructor() { }

  ngOnInit() {
  }

}
