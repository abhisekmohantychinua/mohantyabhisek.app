import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  imports: [ButtonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly document = inject(DOCUMENT);

  readonly darkMode = signal(false);

  toggleTheme(): void {
    this.darkMode.update((v) => !v);
    const htmlElement = this.document.documentElement;
    if (this.darkMode()) {
      htmlElement.classList.add('app-dark');
    } else {
      htmlElement.classList.remove('app-dark');
    }
  }
}
