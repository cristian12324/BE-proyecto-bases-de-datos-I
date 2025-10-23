import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioEdit: Usuario | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  editar(usuario: Usuario): void {
    this.usuarioEdit = { ...usuario };
  }

  guardar(form: NgForm): void {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }
    if (this.usuarioEdit) {
      this.usuarioService.actualizar(this.usuarioEdit).subscribe({
        next: () => {
          alert('Usuario actualizado correctamente');
          this.usuarioEdit = null;
          this.listar();
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar usuario')
      });
    }
  }

  cancelar(): void {
    this.usuarioEdit = null;
  }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente');
          this.listar();
        },
        error: (err) => alert(err.error?.message || 'Error al eliminar usuario')
      });
    }
  }
}
