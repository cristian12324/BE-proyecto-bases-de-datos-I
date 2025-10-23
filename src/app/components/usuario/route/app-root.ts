import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  navegar(ruta: string): void {
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }
}
