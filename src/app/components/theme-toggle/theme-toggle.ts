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
  private readonly storageKey = 'app-dark-mode';
  private readonly document = inject(DOCUMENT);

  readonly darkMode = signal(this.loadTheme());

  constructor() {
    this.applyTheme(this.darkMode());
  }

  toggleTheme(): void {
    this.darkMode.update((v) => !v);
    this.applyTheme(this.darkMode());
    localStorage.setItem(this.storageKey, String(this.darkMode()));
  }

  private loadTheme(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored !== null) {
      return stored === 'true';
    }
    return this.document.documentElement.classList.contains('app-dark');
  }

  private applyTheme(dark: boolean): void {
    const htmlElement = this.document.documentElement;
    if (dark) {
      htmlElement.classList.add('app-dark');
    } else {
      htmlElement.classList.remove('app-dark');
    }
  }
}
