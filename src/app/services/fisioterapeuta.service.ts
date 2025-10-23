import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fisioterapeuta } from '../models/fisioterapeuta';

@Injectable({
  providedIn: 'root'
})
export class FisioterapeutaService {
  private apiUrl = 'http://localhost:8080/api/fisioterapeutas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Fisioterapeuta[]> {
    return this.http.get<Fisioterapeuta[]>(this.apiUrl);
  }

  guardar(fisio: Fisioterapeuta): Observable<Fisioterapeuta> {
    return this.http.post<Fisioterapeuta>(this.apiUrl, fisio);
  }

  actualizar(fisio: Fisioterapeuta): Observable<Fisioterapeuta> {
    return this.http.put<Fisioterapeuta>(`${this.apiUrl}/${fisio.idFisio}`, fisio);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
