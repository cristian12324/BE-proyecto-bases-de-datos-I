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
  selector: 'app-cita-list',
  templateUrl: './cita-list.component.html',
  styleUrls: ['./cita-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CitaListComponent implements OnInit {
  citas: Cita[] = [];
  cita: Cita | null = null;
  pacientes: Paciente[] = [];
  fisioterapeutas: Fisioterapeuta[] = [];
  servicios: Servicio[] = [];
  mensaje: string = '';

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private fisioService: FisioterapeutaService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.fisioService.listar().subscribe(data => this.fisioterapeutas = data);
    this.servicioService.listar().subscribe(data => this.servicios = data);
    this.listar();
  }

  listar(): void {
    this.citaService.listar().subscribe(data => {
      this.citas = data.map(c => ({
        ...c,
        pacienteNombre: c.paciente ? (c.paciente as Paciente).nombre : '',
        fisioterapeutaNombre: c.fisioterapeuta ? (c.fisioterapeuta as Fisioterapeuta).nombreFisio : '',
        servicioNombre: c.servicio ? (c.servicio as Servicio).nombreServi : ''
      }));
    });
  }

  editar(cita: Cita): void {
    this.cita = {
      idCita: cita.idCita,
      pacienteId: cita.paciente?.idPaciente || 0,
      fisioterapeutaId: cita.fisioterapeuta?.idFisio || 0,
      servicioId: cita.servicio?.idServicio || 0,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado
    };
    this.mensaje = '';
  }
  nuevaCita(): void {
  this.cita = {
    pacienteId: 0,
    fisioterapeutaId: 0,
    servicioId: 0,
    fecha: '',
    hora: '',
    estado: 'Pendiente'
  };
}


 guardar(): void {
  if (!this.cita) return;

  if (
    !this.cita.pacienteId ||
    !this.cita.fisioterapeutaId ||
    !this.cita.servicioId ||
    !this.cita.fecha ||
    !this.cita.hora
  ) {
    alert('Completa todos los campos.');
    return;
  }

  const citaParaGuardar: Cita = {
    idCita: this.cita.idCita,
    paciente: { idPaciente: Number(this.cita.pacienteId) },
    fisioterapeuta: { idFisio: Number(this.cita.fisioterapeutaId) },
    servicio: { idServicio: Number(this.cita.servicioId) },
    fecha: this.cita.fecha,
    hora: this.cita.hora,
    estado: this.cita.estado || 'Pendiente'
  };

  console.log('Cita enviada al backend:', citaParaGuardar);

  this.citaService.guardar(citaParaGuardar).subscribe({
    next: () => {
      alert(this.cita?.idCita ? 'Cita actualizada correctamente' : 'Cita guardada correctamente');
      this.cita = null;
      this.listar();
    },
    error: (err) => {
      let mensaje = 'Ocurrió un error al guardar la cita.';
      if (err.error) {
        if (typeof err.error === 'string') mensaje = err.error;
        else if (err.error.message) mensaje = err.error.message;
      }
      alert(mensaje);
    }
  });
}




  cancelar(): void {
    this.cita = null;
    this.mensaje = '';
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Está seguro de eliminar esta cita?')) return;

    this.citaService.eliminar(id).subscribe({
      next: () => {
        alert('Cita eliminada correctamente');
        this.listar();
      },
      error: (error) => {
        alert(error.error || 'Ocurrió un error al eliminar la cita.');
      }
    });
  }
}
