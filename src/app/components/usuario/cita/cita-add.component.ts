import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cita } from '../../../models/cita';
import { CitaService } from '../../../services/cita.service';
import { PacienteService } from '../../../services/paciente.service';
import { FisioterapeutaService } from '../../../services/fisioterapeuta.service';
import { ServicioService } from '../../../services/servicio.service';
import { Paciente } from '../../../models/paciente';
import { Fisioterapeuta } from '../../../models/fisioterapeuta';
import { Servicio } from '../../../models/servicio';

@Component({
  selector: 'app-cita-add',
  templateUrl: './cita-add.component.html',
  styleUrls: ['./cita-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CitaAddComponent implements OnInit {
  cita: Cita = {
    pacienteId: 0,
    fisioterapeutaId: 0,
    servicioId: 0,
    fecha: '',
    hora: '',
    estado: 'Pendiente'
  };

  pacientes: Paciente[] = [];
  fisioterapeutas: any[] = []; // tipo any para map
  servicios: any[] = [];
  mensaje: string = '';

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private fisioService: FisioterapeutaService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.pacienteService.listar().subscribe(data => this.pacientes = data);

    this.fisioService.listar().subscribe(data => {
      this.fisioterapeutas = data.map(f => ({ ...f, nombre: f.nombreFisio }));
    });

    this.servicioService.listar().subscribe(data => {
      this.servicios = data.map(s => ({ ...s, nombre: s.nombreServi }));
    });
  }

  guardar(): void {
    if (!this.cita.pacienteId || !this.cita.fisioterapeutaId || !this.cita.servicioId || !this.cita.fecha || !this.cita.hora) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    this.citaService.guardar(this.cita).subscribe({
      next: () => {
        alert('Cita guardada correctamente');
        this.cita = { pacienteId: 0, fisioterapeutaId: 0, servicioId: 0, fecha: '', hora: '', estado: 'Pendiente' };
        this.mensaje = '';
      },
      error: (err) => {
        this.mensaje = err.error?.message || 'Error al guardar la cita';
      }
    });
  }
}
