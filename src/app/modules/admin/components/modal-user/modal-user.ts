import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { user } from '../../../../shared/models/user.interface';

@Component({
  selector: 'modal-create-user',
  imports: [NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './modal-user.html',
  styles: ``
})
export default class ModalUser {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<user>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(16), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)]],
      lastname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(16), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      documentNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
    });
  }
  onNumberInput(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.form.patchValue({ number: input.value });
  }

  get f() {
    return this.form.controls;
  }

  closeModal() {
    this.close.emit();
  }

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

  onSubmit() {
  if (this.form.valid) {
    const newUser: user = {
      ...this.form.value
    };
    this.save.emit(newUser);
    this.closeModal();
  } else {
    this.form.markAllAsTouched();
  }
}


}
