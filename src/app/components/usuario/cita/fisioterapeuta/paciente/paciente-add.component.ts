import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../../../models/paciente';
import { PacienteService } from '../../../../../services/paciente.service';


@Component({
  selector: 'app-paciente-add',
  templateUrl: './paciente-add.component.html',
  styleUrls: ['./paciente-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PacienteAddComponent implements OnInit {
  paciente: Paciente = { nombre: '', dpi: '', telefono: '', correo: '', direccion: '', fechaNacimiento: '', genero: '', estadoPaciente: '' };
  mensaje: string = '';

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {}

  guardar(): void {
    if (!this.paciente.nombre || !this.paciente.dpi || !this.paciente.telefono || !this.paciente.correo || !this.paciente.direccion || !this.paciente.fechaNacimiento || !this.paciente.genero || !this.paciente.estadoPaciente) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    this.pacienteService.guardar(this.paciente).subscribe({
      next: () => {
        alert('Paciente guardado correctamente');
        this.paciente = { nombre: '', dpi: '', telefono: '', correo: '', direccion: '', fechaNacimiento: '', genero: '', estadoPaciente: '' };
        this.mensaje = '';
      },
      error: (err) => {
        this.mensaje = err.error?.message || 'Error al guardar el paciente';
      }
    });
  }
}
