import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type ComponentFixture,TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BlogContentStep } from './blog-content-step';

describe('BlogContentStep', () => {
  let component: BlogContentStep;
  let fixture: ComponentFixture<BlogContentStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogContentStep],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(BlogContentStep, {
        set: {
          imports: [FormsModule],
          template: '<div></div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogContentStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isValid', () => {
    it('should be false with empty content', () => {
      expect(component.isValid()).toBe(false);
    });

    it('should be false with whitespace-only content', () => {
      component['content'].set('   ');
      expect(component.isValid()).toBe(false);
    });

    it('should be true after setting non-empty content', () => {
      component['content'].set('<p>Hello</p>');
      expect(component.isValid()).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should return current content', () => {
      component['content'].set('<p>Test</p>');
      expect(component.getValue()).toBe('<p>Test</p>');
    });

    it('should return empty string by default', () => {
      expect(component.getValue()).toBe('');
    });
  });

  describe('initialContent input', () => {
    it('should pre-fill content from input', async () => {
      fixture.componentRef.setInput('initialContent', '<h1>Initial</h1>');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.getValue()).toBe('<h1>Initial</h1>');
      expect(component.isValid()).toBe(true);
    });
  });

  describe('editorOptions', () => {
    it('should use vs-dark theme when isDark is true', () => {
      component['isDark'].set(true);
      const options = component['editorOptions']();
      expect(options.theme).toBe('vs-dark');
    });

    it('should use vs theme when isDark is false', () => {
      component['isDark'].set(false);
      const options = component['editorOptions']();
      expect(options.theme).toBe('vs');
    });

    it('should set language to html', () => {
      const options = component['editorOptions']();
      expect(options.language).toBe('html');
    });
  });
});
