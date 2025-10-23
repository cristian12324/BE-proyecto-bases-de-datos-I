import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pago } from '../../../models/pago';
import { PagoService } from '../../../services/pago.service';
import { Cita } from '../../../models/cita';
import { Paciente } from '../../../models/paciente';
import { Fisioterapeuta } from '../../../models/fisioterapeuta';
import { Servicio } from '../../../models/servicio';

@Component({
  selector: 'app-pago-list',
  templateUrl: './pago-list.component.html',
  styleUrls: ['./pago-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PagoListComponent implements OnInit {
  pagos: Pago[] = [];
  pago: Pago | null = null;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.pagoService.listar().subscribe(data => {
      this.pagos = data.map(p => {
        const cita = p.cita as Cita | undefined;

        if (cita) {
          // Creamos propiedades planas para la vista
          (cita as any).pacienteNombre = cita.paciente ? (cita.paciente as Paciente).nombre : '';
          (cita as any).fisioterapeutaNombre = cita.fisioterapeuta ? (cita.fisioterapeuta as Fisioterapeuta).nombreFisio : '';
          (cita as any).servicioNombre = cita.servicio ? (cita.servicio as Servicio).nombreServi : '';
        }

        return { ...p, cita };
      });
    });
  }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Está seguro de eliminar este pago?')) {
      this.pagoService.eliminar(id).subscribe({
        next: () => {
          alert('Pago eliminado correctamente');
          this.listar();
        },
        error: (error) => {
          alert(error.error || 'Ocurrió un error al eliminar el pago.');
        }
      });
    }
  }
}
