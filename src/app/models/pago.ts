import { Cita } from './cita';

export interface Pago {
  idPago?: number;
  fechaPago: string;
  monto: number;
  metodo: string;
  estadoPago: string;

  
  citaId?: number;
  cita?: Cita;

}
