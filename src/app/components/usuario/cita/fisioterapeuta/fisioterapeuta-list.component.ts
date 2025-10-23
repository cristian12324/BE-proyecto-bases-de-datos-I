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
  selector: 'app-fisioterapeuta-list',
  templateUrl: './fisioterapeuta-list.component.html',
  styleUrls: ['./fisioterapeuta-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FisioterapeutaListComponent implements OnInit {
  fisioterapeutas: Fisioterapeuta[] = [];
  fisioterapeuta: Fisioterapeuta | null = null;
  mensaje: string = '';
  idUsuario: number = 1; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.listar(); }

  listar(): void {
    this.http.get<Fisioterapeuta[]>(`http://localhost:8080/api/fisioterapeutas?idUsuario=${this.idUsuario}`)
      .subscribe(data => this.fisioterapeutas = data);
  }

  editar(f: Fisioterapeuta): void {
    this.fisioterapeuta = { ...f };
    this.mensaje = '';
  }

  guardar(): void {
    if (!this.fisioterapeuta) return;

    if (!this.fisioterapeuta.nombreFisio || !this.fisioterapeuta.telefonoFisio ||
        !this.fisioterapeuta.correoFisio || !this.fisioterapeuta.especialidadFisio ||
        !this.fisioterapeuta.estadoFisio) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    const url = this.fisioterapeuta.idFisio
      ? `http://localhost:8080/api/fisioterapeutas/${this.fisioterapeuta.idFisio}`
      : `http://localhost:8080/api/fisioterapeutas`;

    const method = this.fisioterapeuta.idFisio ? 'put' : 'post';

    this.http.request(method, url, { body: this.fisioterapeuta }).subscribe(() => {
      alert(this.fisioterapeuta?.idFisio ? 'Fisioterapeuta actualizado' : 'Fisioterapeuta guardado');
      this.fisioterapeuta = null;
      this.mensaje = '';
      this.listar();
    });
  }

  cancelar(): void { this.fisioterapeuta = null; this.mensaje = ''; }

  eliminar(id?: number): void {
  if (!id) return;

  if (confirm('¿Está seguro de eliminar este fisioterapeuta?')) {
    this.http.delete(`http://localhost:8080/api/fisioterapeutas/${id}`, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert(res);  
          this.listar();
        },
        error: (err) => {
          alert(err.error || 'Error al eliminar el fisioterapeuta.');
        }
      });
  }
}
}
