import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink,ReactiveFormsModule ],
  templateUrl: './register.html',
  styles: ``,
  standalone: true,
})
export default class Register {
  userCreated = false; // ✅ Variable para mostrar alerta

  registerForm: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(20), this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    const atDotTogether = email.includes('@.');
    const dotAtTogether = email.includes('.@');
    if (!hasAt || !hasDot || atDotTogether || dotAtTogether) {
      return { invalidEmail: true };
    }
    return null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (password !== confirm) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData = this.registerForm.value;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('Usuario registrado:', userData);

    this.userCreated = true; // ✅ Mostrar alerta
    setTimeout(() => this.userCreated = false, 3000); // ✅ Ocultar después de 3s

    this.registerForm.reset();
  }
}
