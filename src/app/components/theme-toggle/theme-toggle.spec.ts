import { DOCUMENT } from '@angular/common';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let doc: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    doc = TestBed.inject(DOCUMENT);
    doc.documentElement.classList.remove('app-dark');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('darkMode', () => {
    it('should default to light mode', () => {
      expect(component.darkMode()).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should switch to dark mode on first toggle', () => {
      component.toggleTheme();
      expect(component.darkMode()).toBe(true);
      expect(doc.documentElement.classList.contains('app-dark')).toBe(true);
    });

    it('should switch back to light mode on second toggle', () => {
      component.toggleTheme();
      component.toggleTheme();
      expect(component.darkMode()).toBe(false);
      expect(doc.documentElement.classList.contains('app-dark')).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('should render the button', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-button')).toBeTruthy();
    });

    it('should show moon icon in light mode', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const icon = el.querySelector('p-button .pi');
      expect(icon?.classList.contains('pi-moon')).toBe(true);
    });

    it('should show sun icon in dark mode', () => {
      component.toggleTheme();
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const icon = el.querySelector('p-button .pi');
      expect(icon?.classList.contains('pi-sun')).toBe(true);
    });
  });
});
