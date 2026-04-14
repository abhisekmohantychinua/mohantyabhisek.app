import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-logout',
  imports: [ButtonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logout {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
