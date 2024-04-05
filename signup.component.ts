import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // Corrected typo from styleUrl to styleUrls
})
export class SignupComponent {
  constructor(private fb: FormBuilder, private http:HttpClient, private router: Router) {}
    signup = this.fb.group({
    name: ['',[Validators.required]],
    email:['', [Validators.required, Validators.email]],
    password: [''],
  });
  onSubmit() {
    let user = this.signup.getRawValue();
    this.http.post("http://localhost:3000/api/signup", user).subscribe(
      (response: any) => {
        if(response.message=="success"){
          localStorage.setItem("token",response.token)
          let user:any = jwtDecode(response.token);
          this.router.navigate(['/greet'],{queryParams:{id:user.id}}); 
        }
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }
}
