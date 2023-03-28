import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    if (this.loginService.logged) {
      this.router.navigate(['deck']);
    }
  }

  submit(event) {
    event.preventDefault();
    this.loginService.login(this.username);
    this.router.navigate(['deck']);
  }
}
