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
  rolUsuario: string = '';
  idPacienteLogueado: number | null = null;

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private fisioService: FisioterapeutaService,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      this.rolUsuario = usuario.rol;
      this.idPacienteLogueado = usuario.paciente?.idPaciente || null;
    }

    // Cargar datos siempre
    this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.fisioService.listar().subscribe(data => this.fisioterapeutas = data);
    this.servicioService.listar().subscribe(data => this.servicios = data);

    this.listar();
  }

  listar(): void {
    if (this.rolUsuario === 'Paciente' && this.idPacienteLogueado) {
      // Paciente: solo sus citas
      this.citaService.listarPorPaciente(this.idPacienteLogueado).subscribe(data => {
        this.citas = data.map(c => ({
          ...c,
          pacienteNombre: (c.paciente && 'nombre' in c.paciente) ? (c.paciente as any).nombre : '',
          fisioterapeutaNombre: (c.fisioterapeuta && 'nombreFisio' in c.fisioterapeuta) ? (c.fisioterapeuta as any).nombreFisio : '',
          servicioNombre: (c.servicio && 'nombreServi' in c.servicio) ? (c.servicio as any).nombreServi : ''
        }));
        this.mensaje = this.citas.length ? '' : 'No tienes citas registradas.';
      });
    } else {
      // Admin/Fisio: todas las citas
      this.citaService.listar().subscribe(data => {
        this.citas = data.map(c => ({
          ...c,
          pacienteNombre: (c.paciente && 'nombre' in c.paciente) ? (c.paciente as any).nombre : '',
          fisioterapeutaNombre: (c.fisioterapeuta && 'nombreFisio' in c.fisioterapeuta) ? (c.fisioterapeuta as any).nombreFisio : '',
          servicioNombre: (c.servicio && 'nombreServi' in c.servicio) ? (c.servicio as any).nombreServi : ''
        }));
        this.mensaje = this.citas.length ? '' : 'No hay citas registradas.';
      });
    }
  }

  nuevaCita(): void {
    if (this.rolUsuario === 'Paciente') {
      alert('Los pacientes no pueden crear nuevas citas.');
      return;
    }
    this.cita = {
      pacienteId: 0,
      fisioterapeutaId: 0,
      servicioId: 0,
      fecha: '',
      hora: '',
      estado: 'Pendiente'
    };
  }

  editar(cita: Cita): void {
    if (this.rolUsuario === 'Paciente') {
      alert('No tienes permiso para editar citas.');
      return;
    }
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

  guardar(): void {
    if (!this.cita) return;

    const citaParaGuardar: Cita = {
      idCita: this.cita.idCita,
      paciente: { idPaciente: Number(this.cita.pacienteId) },
      fisioterapeuta: { idFisio: Number(this.cita.fisioterapeutaId) },
      servicio: { idServicio: Number(this.cita.servicioId) },
      fecha: this.cita.fecha,
      hora: this.cita.hora,
      estado: this.cita.estado || 'Pendiente'
    };

    this.citaService.guardar(citaParaGuardar).subscribe({
      next: () => {
        alert(this.cita?.idCita ? 'Cita actualizada correctamente' : 'Cita guardada correctamente');
        this.cita = null;
        this.listar();
      },
      error: () => alert('Error al guardar la cita.')
    });
  }

  cancelar(): void {
    this.cita = null;
    this.mensaje = '';
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (this.rolUsuario === 'Paciente') {
      // Opcional: permitir que el paciente elimine solo sus citas
      if (!confirm('¿Está seguro de cancelar tu cita?')) return;
    } else {
      if (!confirm('¿Está seguro de eliminar esta cita?')) return;
    }

    this.citaService.eliminar(id).subscribe({
      next: () => {
        alert(this.rolUsuario === 'Paciente' ? 'Cita cancelada correctamente' : 'Cita eliminada correctamente');
        this.listar();
      },
      error: () => alert('Error al eliminar la cita.')
    });
  }
}
