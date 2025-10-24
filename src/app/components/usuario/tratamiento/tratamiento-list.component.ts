import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tratamiento } from '../../../models/tratamiento';
import { TratamientoService } from '../../../services/tratamiento.service';
import { CitaService } from '../../../services/cita.service';
import { Cita } from '../../../models/cita';

@Component({
  selector: 'app-tratamiento-list',
  templateUrl: './tratamiento-list.component.html',
  styleUrls: ['./tratamiento-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TratamientoListComponent implements OnInit {
  tratamientos: Tratamiento[] = [];
  citas: Cita[] = [];
  tratamiento: Tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
  mensaje: string = '';
  rolUsuario: string = '';
  idUsuario: number = 0;

  constructor(
    private tratamientoService: TratamientoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    // Obtener rol y usuario
    if (typeof window !== 'undefined') {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        this.rolUsuario = usuario.rol;
        this.idUsuario = usuario.idUsuario;
      }
    }

    // Listar tratamientos según rol
    if (this.rolUsuario === 'Paciente') {
      this.listarMisTratamientos();
    } else {
      this.listarTodosTratamientos();
    }

    this.listarCitasActivas();
  }

  listarMisTratamientos(): void {
    this.tratamientoService.listarMisTratamientos(this.idUsuario).subscribe({
      next: (data) => this.tratamientos = data,
      error: (err) => console.error('Error al listar tratamientos', err)
    });
  }

  listarTodosTratamientos(): void {
    this.tratamientoService.listar().subscribe({
      next: (data: Tratamiento[]) => this.tratamientos = data,
      error: (err) => console.error('Error al listar tratamientos', err)
    });
  }

  listarCitasActivas(): void {
    this.citaService.listar().subscribe({
      next: (data: Cita[]) => this.citas = data.filter(c => c.estado === 'Pendiente'),
      error: (err) => console.error('Error al listar citas', err)
    });
  }

  editar(tratamiento: Tratamiento): void {
    if (this.rolUsuario === 'Paciente') return; // Paciente no puede editar
    this.tratamiento = { ...tratamiento, cita: tratamiento.cita ?? null };
    this.mensaje = '';
  }

  guardar(): void {
    if (this.rolUsuario === 'Paciente') return; // Paciente no puede guardar
    if (!this.tratamiento.descripcion || !this.tratamiento.observaciones || !this.tratamiento.fechaRegistro || !this.tratamiento.cita) {
      this.mensaje = 'Completa todos los campos, incluyendo la cita.';
      return;
    }

    const obs = this.tratamiento.idTratamiento
      ? this.tratamientoService.actualizar(this.tratamiento)
      : this.tratamientoService.guardar(this.tratamiento);

    obs.subscribe({
      next: () => {
        alert(this.tratamiento.idTratamiento ? 'Tratamiento actualizado correctamente' : 'Tratamiento registrado correctamente');
        this.tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
        this.mensaje = '';
        this.rolUsuario === 'Paciente' ? this.listarMisTratamientos() : this.listarTodosTratamientos();
      },
      error: (err) => this.mensaje = err.error?.message || 'Error al guardar tratamiento'
    });
  }

  cancelar(): void {
    this.tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
    this.mensaje = '';
  }

  eliminar(id: number | null): void {
    if (this.rolUsuario === 'Paciente') return; // Paciente no puede eliminar
    if (id !== null && confirm('¿Está seguro de eliminar este tratamiento?')) {
      this.tratamientoService.eliminar(id).subscribe(() => {
        alert('Tratamiento eliminado correctamente');
        this.listarTodosTratamientos();
      });
    }
  }

  getNombrePaciente(cita: Cita): string {
    return cita.paciente && 'nombre' in cita.paciente ? cita.paciente.nombre : 'Paciente no asignado';
  }

  getNombreServicio(cita: Cita): string {
    return cita.servicio && 'nombreServi' in cita.servicio ? cita.servicio.nombreServi : 'Servicio no asignado';
  }
}
