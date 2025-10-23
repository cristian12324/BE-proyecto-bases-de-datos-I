import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  usuario: Usuario = { username: '', password: '', rol: '' };
  errorMensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  iniciarSesion(): void {
    const url = 'http://localhost:8080/api/usuarios/login';
    this.http.post<Usuario>(url, this.usuario).subscribe({
      next: (usuarioValido) => {
        if (usuarioValido) {
          localStorage.setItem('usuario', JSON.stringify(usuarioValido));
          this.router.navigate(['/principal']);
        } else {
          this.errorMensaje = 'Credenciales incorrectas';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'Error al conectar con el servidor';
      },
    });
  }
}
