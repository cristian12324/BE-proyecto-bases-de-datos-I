import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  rolUsuario: string = '';  // Para controlar visibilidad
  private apiUrl = 'http://localhost:8080/api/citas/solicitar';

  constructor(private servicioService: ServicioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.listar();

    // Solo acceder a localStorage si estamos en el navegador
    if (typeof window !== 'undefined') {
      const usuarioStr = localStorage.getItem('usuario');
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      this.rolUsuario = usuario?.rol?.toLowerCase() || '';  // Normalizar a minúsculas
    } else {
      this.rolUsuario = '';
    }
  }

  listar(): void {
    this.servicioService.listar().subscribe(data => this.servicios = data);
  }

  editar(servicio: Servicio): void {
    if (this.rolUsuario === 'paciente') return;  // Bloqueo para paciente
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
      this.servicioService.actualizar(this.servicio).subscribe({
        next: () => { 
          alert('Servicio actualizado correctamente'); 
          this.servicio = null; 
          this.mensaje = ''; 
          this.listar(); 
        },
        error: (err) => { 
          this.mensaje = err.error?.message || 'Error al actualizar el servicio'; 
        }
      });
    } else {
      this.servicioService.guardar(this.servicio).subscribe({
        next: () => { 
          alert('Servicio registrado correctamente'); 
          this.servicio = null; 
          this.mensaje = ''; 
          this.listar(); 
        },
        error: (err) => { 
          this.mensaje = err.error?.message || 'Error al guardar el servicio'; 
        }
      });
    }
  }

  cancelar(): void { 
    this.servicio = null; 
    this.mensaje = ''; 
  }

  eliminar(id: number | undefined): void {
  if (this.rolUsuario === 'paciente') return;  // Bloqueo para paciente

  if (id && confirm('¿Está seguro de eliminar este servicio?')) {
    this.servicioService.eliminar(id).subscribe({
      next: () => { 
        alert('Servicio eliminado correctamente'); 
        this.listar(); 
      },
      error: (err) => {
        // Si es un error de restricción de integridad, mostramos un mensaje amigable
        if (err.status === 400 || err.status === 500) {
          alert('No se puede eliminar este servicio porque tiene citas asociadas.');
        } else {
          alert(err.error?.message || 'Error al eliminar el servicio.');
        }
      }
    });
  }
}


  solicitarServicio(idServicio: number): void {
    if (typeof window === 'undefined') return;  // Protege en SSR

    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    const idUsuario = usuario?.idUsuario;

    if (!idUsuario) {
      alert('No se encontró el usuario logueado.');
      return;
    }

    this.http.post(`${this.apiUrl}?idUsuario=${idUsuario}&idServicio=${idServicio}`, {}).subscribe({
      next: () => { alert('Cita creada correctamente'); },
      error: (err) => { alert(err.error?.message || 'Error al solicitar la cita.'); }
    });
  }
}
