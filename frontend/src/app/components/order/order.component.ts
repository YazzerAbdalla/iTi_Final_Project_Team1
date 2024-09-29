import { Component, OnInit } from '@angular/core';
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: number;
  date: string;
  items: OrderItem[];
  totalPrice: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit(): void {
    // Sample data for order history
    this.orders = [
      {
        id: 1,
        date: '2024-09-20',
        items: [
          {
            id: 1,
            name: 'Product 1',
            price: 20,
            quantity: 2,
            imageUrl: 'https://via.placeholder.com/100',
          },
          {
            id: 2,
            name: 'Product 2',
            price: 15,
            quantity: 1,
            imageUrl: 'https://via.placeholder.com/100',
          },
        ],
        totalPrice: 55,
      },
      {
        id: 2,
        date: '2024-09-15',
        items: [
          {
            id: 3,
            name: 'Product 3',
            price: 30,
            quantity: 1,
            imageUrl: 'https://via.placeholder.com/100',
          },
        ],
        totalPrice: 30,
      },
    ];
  }
}
