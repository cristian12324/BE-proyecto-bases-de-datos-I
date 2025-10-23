import { Paciente } from './paciente';
import { Fisioterapeuta } from './fisioterapeuta';
import { Servicio } from './servicio';

export interface Cita {
  idCita?: number;
  pacienteId?: number;
  fisioterapeutaId?: number;
  servicioId?: number;
  fecha?: string;
  hora?: string;
  estado?: string;

  // Relaciones opcionales
  paciente?: Paciente | { idPaciente: number };
  fisioterapeuta?: Fisioterapeuta | { idFisio: number };
  servicio?: Servicio | { idServicio: number };

  // Propiedades planas para templates
  pacienteNombre?: string;
  fisioterapeutaNombre?: string;
  servicioNombre?: string;
}
