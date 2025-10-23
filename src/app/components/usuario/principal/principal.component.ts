import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PrincipalComponent implements OnInit {
  usuario: any;

  constructor(public session: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.session.getUsuario();

    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
