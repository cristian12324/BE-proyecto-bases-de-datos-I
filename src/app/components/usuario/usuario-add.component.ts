import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-add',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuarioAddComponent {
  usuario: Usuario = { username: '', password: '', rol: '', idUsuario: undefined };
  
  constructor(private usuarioService: UsuarioService) {}

  guardar(form: NgForm): void {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Construir payload según rol
    let usuarioPayload: any = {
      username: this.usuario.username,
      password: this.usuario.password,
      rol: this.usuario.rol
    };

    if (this.usuario.rol === 'Paciente') {
      usuarioPayload.paciente = {
        nombre: this.usuario.nombre,
        dpi: this.usuario.dpi,
        telefono: this.usuario.telefono
      };
    } else if (this.usuario.rol === 'Fisioterapeuta') {
      usuarioPayload.fisioterapeuta = {
        nombreFisio: this.usuario.nombreFisio,
        telefonoFisio: this.usuario.telefonoFisio,
        especialidadFisio: this.usuario.especialidadFisio,
        correoFisio: this.usuario.correoFisio
      };
    }

    this.usuarioService.crearUsuario(usuarioPayload).subscribe({
      next: () => {
        alert('Usuario agregado correctamente');
        this.usuario = { username: '', password: '', rol: '', idUsuario: undefined };
        form.resetForm();
      },
      error: (err) => alert(err.error?.message || 'Error al agregar usuario')
    });
  }
}
