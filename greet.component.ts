import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
HttpClient
@Component({
  selector: 'app-greet',
  templateUrl: './greet.component.html',
  styleUrl: './greet.component.css'
})
export class GreetComponent {
 message:any;
 email:any;
 id:string;
 greet:FormGroup;
 tasks: any[] = [];
 editable: boolean[] = []
 constructor(private fb:FormBuilder,private http:HttpClient,private route:ActivatedRoute,private router: Router){ 
  this.route.queryParams.subscribe(params=>{
    this.id=params['id'];
    this.http.get(`http://localhost:3000/api/user/${this.id}`,)
    .subscribe((res:any)=>{
     this.message = `${res.name}`;
    },
    (err)=>{
     this.message = "You are not logged in"
    })
  })
  this.greet = this.fb.group({
    task: ['', Validators.required] 
  });
  this.fetchTasks();
 }
 fetchTasks(){
  this.http.get<any[]>(`http://localhost:3000/api/tasks/${this.id}`)
  .subscribe(tasks => {
    this.greet.reset();
    console.log('Fetched tasks:', tasks); 
    this.tasks = tasks;
    this.editable=Array(tasks.length).fill(false);
  }, error => {
    console.error('Error fetching tasks:', error);
  });
}
 onSubmit(){
  if (this.greet.invalid) { 
    return;
  }
  const taskValue = this.greet.value.task;
  this.http.post('http://localhost:3000/api/tasks', { user: this.id, task: taskValue })
    .subscribe((res: any) => {
      console.log('Task stored successfully:', res);
      this.fetchTasks();
    }, (err) => {
      console.error('Error storing task:', err);
    });
}
deleteTask(taskId: string) {
  this.http.delete(`http://localhost:3000/api/tasks/${taskId}`)
    .subscribe((res: any) => {
      console.log('Task deleted successfully:', res);
      this.fetchTasks();
    }, (err) => {
      console.error('Error deleting task:', err);
    });
}
edit(i: number, task: any) {
  if (!this.editable[i]) {
    this.editable[i] = true;
  } else {
    this.editable[i] = false;
  }
}

save(i: number, task: any) {
  if (!this.editable[i]) {
    return;
  }
  this.editable[i] = false;
  this.http.put(`http://localhost:3000/api/tasks/${task._id}`, task)
    .subscribe((res: any) => {
      console.log('Task updated successfully:', res);
      this.fetchTasks();
    }, (err) => {
      console.error('Error updating task:', err);
    });
}

logout(){
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
 }