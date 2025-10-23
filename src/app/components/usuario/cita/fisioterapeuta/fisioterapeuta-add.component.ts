import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Fisioterapeuta {
  idFisio?: number;
  nombreFisio: string;
  telefonoFisio: string;
  correoFisio: string;
  especialidadFisio: string;
  estadoFisio: string;
}

@Component({
  selector: 'app-fisioterapeuta-add',
  templateUrl: './fisioterapeuta-add.component.html',
  styleUrls: ['./fisioterapeuta-add.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FisioterapeutaAddComponent implements OnInit {
  fisioterapeuta: Fisioterapeuta = { nombreFisio: '', telefonoFisio: '', correoFisio: '', especialidadFisio: '', estadoFisio: '' };
  mensaje: string = '';
  idUsuario: number = 1; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void { }

  guardar(): void {
    if (!this.fisioterapeuta.nombreFisio || !this.fisioterapeuta.telefonoFisio ||
        !this.fisioterapeuta.correoFisio || !this.fisioterapeuta.especialidadFisio ||
        !this.fisioterapeuta.estadoFisio) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    this.http.post(`http://localhost:8080/api/fisioterapeutas`, this.fisioterapeuta)
      .subscribe({
        next: () => {
          alert('Fisioterapeuta guardado correctamente');
          this.fisioterapeuta = { nombreFisio: '', telefonoFisio: '', correoFisio: '', especialidadFisio: '', estadoFisio: '' };
          this.mensaje = '';
        },
        error: (err) => { this.mensaje = err.error?.message || 'Error al guardar'; }
      });
  }
}
