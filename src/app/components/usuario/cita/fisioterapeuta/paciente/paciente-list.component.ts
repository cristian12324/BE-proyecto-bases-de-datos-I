import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../../../models/paciente';
import { PacienteService } from '../../../../../services/paciente.service';

@Component({
  selector: 'app-paciente-list',
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  paciente: Paciente | null = null;
  mensaje: string = '';

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.pacienteService.listar().subscribe(data => this.pacientes = data);
  }

  editar(paciente: Paciente): void {
    this.paciente = { ...paciente };
    this.mensaje = '';
  }

  guardar(): void {
    if (!this.paciente) return;

    if (!this.paciente.nombre || !this.paciente.dpi || !this.paciente.telefono || !this.paciente.correo || !this.paciente.direccion || !this.paciente.fechaNacimiento || !this.paciente.genero || !this.paciente.estadoPaciente) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    this.pacienteService.guardar(this.paciente).subscribe({
      next: () => {
        alert(this.paciente?.idPaciente ? 'Paciente actualizado correctamente' : 'Paciente guardado correctamente');
        this.paciente = null;
        this.mensaje = '';
        this.listar();
      },
      error: (err) => { this.mensaje = err.error?.message || 'Error al guardar el paciente'; }
    });
  }

  cancelar(): void { this.paciente = null; this.mensaje = ''; }

 eliminar(id: number | undefined): void {
  if (id && confirm('¿Está seguro de eliminar este paciente?')) {
    this.pacienteService.eliminar(id).subscribe({
      next: (res: any) => {
        alert(res);  // Mensaje que viene del backend
        this.listar();
      },
      error: (err) => {
        alert(err.error || 'Error desconocido al eliminar el paciente'); // Mensaje del backend o genérico
      }
    });
  }
}
}
