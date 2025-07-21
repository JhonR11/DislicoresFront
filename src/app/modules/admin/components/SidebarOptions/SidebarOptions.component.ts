import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface sidebarOptions{
  label:string
  icon:string
  route:string
}


@Component({
  selector: 'sidebar-options',
  imports: [RouterLink],
  templateUrl: './SidebarOptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarOptionsComponent {

  sidebarOptions: sidebarOptions[] = [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-house',
      route: '/admin/dashboard'
    },
    {
      label: 'Productos',
      icon: 'fa-solid fa-wine-bottle',
      route: '/admin/products'
    },
    {
      label: 'Crear Usuarios',
      icon: 'fa-solid fa-user-pen',
      route: '/admin/users'
    },
    {
      label: 'Crear venta',
      icon: 'fa-solid fa-cash-register',
      route: '/admin/sales'
    },
  ]
 }
