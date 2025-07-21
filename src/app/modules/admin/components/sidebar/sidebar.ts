import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../auth/service/auth';
import { SidebarOptionsComponent } from "../SidebarOptions/SidebarOptions.component";


@Component({
  selector: 'app-sidebar',
  imports: [ SidebarOptionsComponent],
  templateUrl: './sidebar.html',
})
export default class Sidebar{
  
}

