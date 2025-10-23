import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../../../models/servicio';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-servicio-list',
  templateUrl: './servicio-list.component.html',
  styleUrls: ['./servicio-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServicioListComponent implements OnInit {
  servicios: Servicio[] = [];
  servicio: Servicio | null = null;
  mensaje: string = '';

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.servicioService.listar().subscribe(data => this.servicios = data);
  }

  editar(servicio: Servicio): void {
    this.servicio = { ...servicio };
    this.mensaje = '';
  }

  guardar(): void {
  if (!this.servicio) return;

  if (!this.servicio.nombreServi || !this.servicio.descripcionServi || !this.servicio.precioServi || !this.servicio.duracionMin) {
    this.mensaje = 'Completa todos los campos.';
    return;
  }

  if (this.servicio.idServicio) {
    // Si ya tiene id, usamos actualizar (PUT)
    this.servicioService.actualizar(this.servicio).subscribe({
      next: () => {
        alert('Servicio actualizado correctamente');
        this.servicio = null;
        this.mensaje = '';
        this.listar();
      },
      error: (err) => { this.mensaje = err.error?.message || 'Error al actualizar el servicio'; }
    });
  } else {
   
    this.servicioService.guardar(this.servicio).subscribe({
      next: () => {
        alert('Servicio registrado correctamente');
        this.servicio = null;
        this.mensaje = '';
        this.listar();
      },
      error: (err) => { this.mensaje = err.error?.message || 'Error al guardar el servicio'; }
    });
  }
}

  cancelar(): void { this.servicio = null; this.mensaje = ''; }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Está seguro de eliminar este servicio?')) {
      this.servicioService.eliminar(id).subscribe(() => {
        alert('Servicio eliminado correctamente');
        this.listar();
      });
    }
  }
}
