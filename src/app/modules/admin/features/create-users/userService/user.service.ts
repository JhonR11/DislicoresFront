import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { enviroment } from '../../../../../shared/constans';
import type { UserResponse } from '../../../../../shared/models/users.interfaces';
import { user } from '../../../../../shared/models/user.interface';
import { UserMapper } from '../mapper/user.mapper';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private token: string | null;

  userloading = signal(true);
  users= signal<user[]>([])

  constructor() { 
    this.token = localStorage.getItem('accessToken');
    this.loadUsers();
  }

  loadUsers() {
      this.http.get<UserResponse>(`${enviroment.ApiUrl}/get-all`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${this.token}`,
      },
    }).subscribe({
      next: (resp) => {
      
          const users = UserMapper.mapUserItemsArray(resp.data.page);
          this.users.set(users);
          this.userloading.set(false);
          console.log(users);
      }
    });
  }
  createUser(newUser: user) {
  return this.http.post(`${enviroment.ApiUrl}/create`, newUser, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${this.token}`,
    },
  });
}


}
