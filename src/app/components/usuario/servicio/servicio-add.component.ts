import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../../../models/servicio';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-servicio-add',
  templateUrl: './servicio-add.component.html',
  styleUrls: ['./servicio-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServicioAddComponent implements OnInit {
  servicio: Servicio = { nombreServi: '', descripcionServi: '', precioServi: 0, duracionMin: 0, estadoServicio: 'Activo' };
  mensaje: string = '';

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {}

  guardar(): void {
    if (!this.servicio.nombreServi || !this.servicio.descripcionServi || this.servicio.precioServi == null || !this.servicio.duracionMin) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    // Asegurar que los campos numéricos son números
    this.servicio.precioServi = Number(this.servicio.precioServi);
    this.servicio.duracionMin = Number(this.servicio.duracionMin);

    this.servicioService.guardar(this.servicio).subscribe({
      next: () => {
        alert('Servicio registrado correctamente');
        this.servicio = { nombreServi: '', descripcionServi: '', precioServi: 0, duracionMin: 0, estadoServicio: 'Activo' };
        this.mensaje = '';
      },
      error: (err) => this.mensaje = err.error?.message || 'Error al registrar el servicio'
    });
  }
}
