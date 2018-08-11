import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private onlineUsersUrl = 'http://localhost:3000/GetOnlineUsers';
  constructor( private http: HttpClient) { }
  getOnlineUsers (): Observable<any[]> {
    return this.http.get<any[]>(this.onlineUsersUrl)
  }

}
