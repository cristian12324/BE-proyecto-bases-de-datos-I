export interface Usuario {
  idUsuario?: number;
  username: string;
  password: string;
  rol: string;
  estadoUsuario?: string;

  // Campos de Paciente
  nombre?: string;
  dpi?: string;
  telefono?: string;

  // Campos de Fisioterapeuta
  nombreFisio?: string;
  telefonoFisio?: string;
  especialidadFisio?: string;
  correoFisio?: string;
}
