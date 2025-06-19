import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  products = [
    { id: 1, name: 'Producto 1', price: '$100', img: '' },
    { id: 2, name: 'Producto 2', price: '$150', img: '' },
    { id: 3, name: 'Producto 3', price: '$200', img: '' },
  ];
}
