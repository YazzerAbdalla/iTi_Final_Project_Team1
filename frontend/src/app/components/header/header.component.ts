import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0;
  isMobileMenuOpen = false;
  constructor(public router: Router) {}
  ngOnInit(): void {}
  handleMobileMenuOpen() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
