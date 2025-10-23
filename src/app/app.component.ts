import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule]
})
export class AppComponent implements OnInit {
  usuarioLogueado: boolean = false;
  rolUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkSesion();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkSesion();
      }
    });
  }

  checkSesion() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuarioLogueado = true;
      const usuario = JSON.parse(usuarioStr);
      this.rolUsuario = usuario.rol;
    } else {
      this.usuarioLogueado = false;
      this.rolUsuario = '';
    }
  }

  navegar(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const ruta = selectElement.value;
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioLogueado = false;
    this.rolUsuario = '';
    this.router.navigate(['/login']);
  }

  esAdmin(): boolean {
    return this.rolUsuario === 'Admin';
  }

  esFisioterapeuta(): boolean {
    return this.rolUsuario === 'Fisioterapeuta';
  }

  esPaciente(): boolean {
    return this.rolUsuario === 'Paciente';
  }
}
