import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
     data: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    this.http.get<any[]>('http://localhost:3000/api/admin').subscribe(
      (tasks) => {
        const groupedTasks:any = {};
        tasks.forEach(task => {
          if (!groupedTasks[task.user.email]) {
            groupedTasks[task.user.email] = [];
          }
          groupedTasks[task.user.email].push(task.mytasks);
        });
        this.data = Object.keys(groupedTasks).map(user => ({
          user,
          tasks: groupedTasks[user]
        }));
        console.log(this.data)
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
}
