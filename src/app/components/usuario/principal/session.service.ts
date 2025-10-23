import { Injectable } from '@angular/core';
import { Usuario } from '../../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private usuarioActual: Usuario | null = null;

  setUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): Usuario | null {
    if (!this.usuarioActual) {
      const u = localStorage.getItem('usuario');
      if (u) this.usuarioActual = JSON.parse(u);
    }
    return this.usuarioActual;
  }

  esAdmin(): boolean {
    return this.getUsuario()?.rol === 'Admin';
  }

  esFisioterapeuta(): boolean {
    return this.getUsuario()?.rol === 'Fisioterapeuta';
  }

  esPaciente(): boolean {
    return this.getUsuario()?.rol === 'Paciente';
  }
}
