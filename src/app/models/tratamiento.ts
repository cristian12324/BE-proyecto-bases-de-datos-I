import { Cita } from './cita';

export interface Tratamiento {
  idTratamiento: number | null; 
  cita: Cita | null;            
  descripcion: string;
  observaciones: string;
  fechaRegistro: string;
}
