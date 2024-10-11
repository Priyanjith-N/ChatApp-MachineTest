import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private router: Router = inject(Router);
  
  isRouteActive(route: string): boolean {
    return this.router.isActive(route, { paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "ignored" });
  }
}
