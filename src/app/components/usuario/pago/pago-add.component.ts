import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pago } from '../../../models/pago';
import { PagoService } from '../../../services/pago.service';
import { CitaService } from '../../../services/cita.service';
import { Cita } from '../../../models/cita';
import { Paciente } from '../../../models/paciente';
import { Fisioterapeuta } from '../../../models/fisioterapeuta';
import { Servicio } from '../../../models/servicio';

@Component({
  selector: 'app-pago-add',
  templateUrl: './pago-add.component.html',
  styleUrls: ['./pago-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PagoAddComponent implements OnInit {
  pago: Pago = { citaId: 0, fechaPago: '', monto: 0, metodo: '', estadoPago: 'Pendiente' };
  citas: Cita[] = [];
  mensaje: string = '';

  constructor(private pagoService: PagoService, private citaService: CitaService) {}

  ngOnInit(): void {
    // Cargar citas con nombres legibles
    this.citaService.listar().subscribe(data => {
      this.citas = data.map(c => ({
        ...c,
        pacienteNombre: c.paciente ? (c.paciente as Paciente).nombre : '',
        fisioterapeutaNombre: c.fisioterapeuta ? (c.fisioterapeuta as Fisioterapeuta).nombreFisio : '',
        servicioNombre: c.servicio ? (c.servicio as Servicio).nombreServi : ''
      }));
    });
  }

  guardar(): void {
    if (!this.pago.citaId || !this.pago.fechaPago || !this.pago.monto || !this.pago.metodo) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    // Convertir el monto a número
    this.pago.monto = Number(this.pago.monto);

    // ✅ Crear el objeto que espera el backend
    const pagoAEnviar: Pago = {
      ...this.pago,
      cita: { idCita: this.pago.citaId }, // <-- se agrega la relación correctamente
      estadoPago: this.pago.estadoPago || 'Pendiente'
    };

    this.pagoService.guardar(pagoAEnviar).subscribe({
      next: () => {
        alert('Pago registrado correctamente');
        this.pago = { citaId: 0, fechaPago: '', monto: 0, metodo: '', estadoPago: 'Pendiente' };
        this.mensaje = '';
      },
      error: (err) => {
        this.mensaje = err.error?.message || 'Error al registrar el pago';
      }
    });
  }
}
