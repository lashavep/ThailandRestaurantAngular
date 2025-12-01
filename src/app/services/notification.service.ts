import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public hubConnection!: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7183/notificationHub')
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Error:', err));

    this.hubConnection.on('ReceiveOrderNotification', (notification: any) => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([...current, notification]);
    });
  }

  loadPersistedNotifications() {
    this.http.get<any[]>('https://localhost:7183/api/Notifications/GetAll')
      .subscribe(nots => {
        this.notificationsSubject.next(nots);
      });
  }
}

