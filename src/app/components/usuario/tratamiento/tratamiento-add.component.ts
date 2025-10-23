import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tratamiento } from '../../../models/tratamiento';
import { TratamientoService } from '../../../services/tratamiento.service';
import { CitaService } from '../../../services/cita.service';
import { Cita } from '../../../models/cita';

@Component({
  selector: 'app-tratamiento-add',
  templateUrl: './tratamiento-add.component.html',
  styleUrls: ['./tratamiento-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TratamientoAddComponent implements OnInit {
  tratamiento: Tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
  fechaRegistroString: string = '';
  citas: Cita[] = [];
  mensaje: string = '';

  constructor(
    private tratamientoService: TratamientoService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.fechaRegistroString = new Date().toISOString().split('T')[0];
    this.listarCitasActivas();
  }

  listarCitasActivas(): void {
    this.citaService.listar().subscribe({
      next: (data: Cita[]) => this.citas = data.filter(c => c.estado === 'Activo'),
      error: (err) => console.error('Error al listar citas', err)
    });
  }

  guardar(): void {
    if (!this.tratamiento.descripcion || !this.tratamiento.observaciones || !this.fechaRegistroString || !this.tratamiento.cita) {
      this.mensaje = 'Completa todos los campos, incluyendo la cita.';
      return;
    }

    this.tratamiento.fechaRegistro = this.fechaRegistroString;

    this.tratamientoService.guardar(this.tratamiento).subscribe({
      next: () => {
        alert('Tratamiento registrado correctamente');
        this.tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
        this.fechaRegistroString = new Date().toISOString().split('T')[0];
        this.mensaje = '';
      },
      error: (err) => this.mensaje = err.error?.message || 'Error al registrar tratamiento'
    });
  }

  cancelar(): void {
    this.tratamiento = { idTratamiento: null, descripcion: '', observaciones: '', fechaRegistro: '', cita: null };
    this.mensaje = '';
  }

  getNombrePaciente(cita: Cita): string {
    if (!cita.paciente) return 'Paciente no asignado';
    if ('nombre' in cita.paciente) return cita.paciente.nombre;
    return 'Paciente no asignado';
  }

  getNombreServicio(cita: Cita): string {
    if (!cita.servicio) return 'Servicio no asignado';
    if ('nombreServi' in cita.servicio) return cita.servicio.nombreServi;
    return 'Servicio no asignado';
  }
}
