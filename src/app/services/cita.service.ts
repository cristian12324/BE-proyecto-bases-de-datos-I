import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  guardar(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  actualizar(cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${cita.idCita}`, cita);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
