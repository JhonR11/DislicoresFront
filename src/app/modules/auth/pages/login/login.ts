import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../service/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styles: ``,
})
export default class Login {
  email: string = '';
  password: string = '';
  error = '';
  success = '';
  loading = false;

  emailInvalid: boolean = false;
  passwordInvalid: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
  this.error = '';
  this.success = '';

  this.emailInvalid = !this.email || !this.validateEmail(this.email);
  this.passwordInvalid = !this.password;

  if (this.emailInvalid || this.passwordInvalid) {
    this.error = 'Por favor completa todos los campos correctamente.';
    this.autoCloseAlert();
    return;
  }

  this.loading = true;

  this.auth.login(this.email, this.password).subscribe({
    next: (res) => {
 
      if (res && res.error) {
        this.error = typeof res.error; 
        this.loading = false;
        this.autoCloseAlert();
        return;
      }

   
      this.success = 'Inicio de sesión exitoso. Redirigiendo...';
      this.loading = false;
      this.autoCloseAlert();
      setTimeout(() => this.router.navigate(['/admin/layout']), 1500);
    },
    error: (err) => {
  this.error = 'Credenciales incorrectas. Intenta de nuevo.';
  this.emailInvalid = true;
  this.passwordInvalid = true;
  this.loading = false;
  this.autoCloseAlert();
},

  });
}


  autoCloseAlert() {
    setTimeout(() => {
      this.error = '';
      this.success = '';
    }, 2000);
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
