import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';

@Component({
selector: 'app-layout',
imports: [Header, RouterOutlet, Sidebar],
templateUrl: './layout.html',
styles: ``
})
export default class Layout {

}