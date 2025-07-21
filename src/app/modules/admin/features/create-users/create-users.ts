import { Component, computed, inject } from '@angular/core';
import { UserService } from './userService/user.service';
import { NgFor } from '@angular/common';
import ModalUser from "../../components/modal-user/modal-user";
import { user } from '../../../../shared/models/user.interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-users',
  imports: [NgFor, ModalUser],
  templateUrl: './create-users.html',
  styles: ``
})
export  default class CreateUsers {
[x: string]: any;
 userService=inject( UserService);

 
 ModalOpen = false;
 openModal() {
    this.ModalOpen = true;
  }
  closeModal() {
      this.ModalOpen = false;
  }

  onSave(newUser: user) {
  console.log('Intentando guardar usuario:', newUser);

  this.userService.createUser(newUser).subscribe({
    next: () => {
      console.log('Usuario creado exitosamente');
      this.showSuccessAlert();
      this.userService.loadUsers();
      this.closeModal();
    },
    error: (err: any) => {
      console.error('Error al crear usuario', err);
      this.showErrorAlert();
    }
  });
}

showSuccessAlert() {
  Swal.fire({
    title: '¡Usuario creado!',
    text: 'El usuario se guardó exitosamente',
    icon: 'success',
    confirmButtonColor: '#22c55e', 
  });
}

showErrorAlert() {
  Swal.fire({
    title: '❌ Error',
    text: 'Hubo un problema al crear el usuario',
    icon: 'error',
  });
}
}
