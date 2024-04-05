import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit{
  constructor(private fb: FormBuilder, private http:HttpClient, private router: Router) {}
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if(token){
      let user:any = jwtDecode(token);
      this.router.navigate(['/greet'],{queryParams:{id:user.id}}); 
    }
  }
  login = this.fb.group({
    email: [''],
    password: [''],
  });
  public loading: boolean = false;
  onSubmit() {
    this.loading = true; 
    let user = this.login.getRawValue();
    if (user.email === "admin@gmail.com" && user.password === "admin") {
      this.router.navigate(['/admin']);
    } else {
      this.http.post("http://localhost:3000/api/login", user).subscribe(
        (response: any) => {
          if(response.message == "success"){
            localStorage.setItem("token", response.token);
            let user: any = jwtDecode(response.token);
            setTimeout(() => {

              this.router.navigate(['/greet'], {queryParams: {id: user.id}});
            }, 2000)
          }
        },
        (err) => {
          console.log(err.error.message);
        }
 
      );
    }
  }
  
}
