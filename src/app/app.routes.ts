import { Routes } from '@angular/router';


import { UsuarioListComponent } from './components/usuario/usuario-list.component';
import { UsuarioAddComponent } from './components/usuario/usuario-add.component';
import { LoginComponent } from './components/usuario/login/login.component';
import { PrincipalComponent } from './components/usuario/principal/principal.component';
import { FisioterapeutaListComponent } from './components/usuario/cita/fisioterapeuta/fisioterapeuta-list.component';
import { FisioterapeutaAddComponent } from './components/usuario/cita/fisioterapeuta/fisioterapeuta-add.component';
import { PacienteListComponent } from './components/usuario/cita/fisioterapeuta/paciente/paciente-list.component';
import { PacienteAddComponent } from './components/usuario/cita/fisioterapeuta/paciente/paciente-add.component';
import { CitaListComponent } from './components/usuario/cita/cita-list.component';
import { CitaAddComponent } from './components/usuario/cita/cita-add.component';
import { PagoListComponent } from './components/usuario/pago/pago-list.component';
import { PagoAddComponent } from './components/usuario/pago/pago-add.component';
import { ServicioListComponent } from './components/usuario/servicio/servicio-list.component';
import { ServicioAddComponent } from './components/usuario/servicio/servicio-add.component';
import { TratamientoListComponent } from './components/usuario/tratamiento/tratamiento-list.component';
import { TratamientoAddComponent } from './components/usuario/tratamiento/tratamiento-add.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent },

  

  

  // Usuarios
  { path: 'usuarios/listar', component: UsuarioListComponent },
  { path: 'usuarios/agregar', component: UsuarioAddComponent },

  
  // Fisioterapeutas
  { path: 'fisioterapeutas/listar', component: FisioterapeutaListComponent },
  { path: 'fisioterapeutas/agregar', component: FisioterapeutaAddComponent },

  // Pacientes
  { path: 'pacientes/listar', component: PacienteListComponent },
  { path: 'pacientes/agregar', component: PacienteAddComponent },

  // Citas
  { path: 'citas/listar', component: CitaListComponent },
  { path: 'citas/agregar', component: CitaAddComponent },

  // Pagos
  { path: 'pagos/listar', component: PagoListComponent },
  { path: 'pagos/agregar', component: PagoAddComponent },

  // Servicios
  { path: 'servicios/listar', component: ServicioListComponent },
  { path: 'servicios/agregar', component: ServicioAddComponent },

  // Tratamientos
  { path: 'tratamientos/listar', component: TratamientoListComponent },
  { path: 'tratamientos/agregar', component: TratamientoAddComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
