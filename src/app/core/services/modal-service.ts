import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../shared/models/products';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  handleOpenModal(flag:boolean):boolean{
    return flag=true
  }
  handleCloseModal(flag:boolean):boolean{
    return !flag
  }

  

}
