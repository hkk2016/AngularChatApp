import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule,Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AboutComponent } from './about/about.component';
import { OnlineUserComponent } from './chat/chatOnlineUsers/online-user.component';
import { ChatMessageComponent } from './chat/chatMessage/chat-message.component';
import { LoginComponent } from './login/login.component';

import {GlobalVariablesService} from './login/loginService/global-variables.service'
import { ChatService } from './chat/chatService/chat.service';



const appRoutes: Routes=[
  {path:'home',component:HomeComponent},
  {path:'chat',component:ChatComponent},
  {path:'about',component:AboutComponent},
  {path:'login',component:LoginComponent},
  {path:'',redirectTo:'/home',pathMatch:'full'}]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    AboutComponent,
    OnlineUserComponent,
    ChatMessageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule

  ],
  providers: [GlobalVariablesService,ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
