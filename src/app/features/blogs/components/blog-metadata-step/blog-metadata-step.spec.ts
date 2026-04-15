import { type ComponentFixture,TestBed } from '@angular/core/testing';

import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogMetadataStep } from './blog-metadata-step';

describe('BlogMetadataStep', () => {
  let component: BlogMetadataStep;
  let fixture: ComponentFixture<BlogMetadataStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogMetadataStep],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogMetadataStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isValid', () => {
    it('should be true when both fields are empty', () => {
      expect(component.isValid()).toBe(true);
    });

    it('should be true when metaTitle has valid length (40-60 chars)', () => {
      component.form.controls.metaTitle.setValue('a'.repeat(50));
      expect(component.isValid()).toBe(true);
    });

    it('should be false when metaTitle is too short (< 40)', () => {
      component.form.controls.metaTitle.setValue('a'.repeat(10));
      expect(component.isValid()).toBe(false);
    });

    it('should be false when metaTitle is too long (> 60)', () => {
      component.form.controls.metaTitle.setValue('a'.repeat(61));
      expect(component.isValid()).toBe(false);
    });

    it('should be true when metaDescription has valid length (120-155 chars)', () => {
      component.form.controls.metaDescription.setValue('a'.repeat(130));
      expect(component.isValid()).toBe(true);
    });

    it('should be false when metaDescription is too short (< 120)', () => {
      component.form.controls.metaDescription.setValue('a'.repeat(50));
      expect(component.isValid()).toBe(false);
    });

    it('should be false when metaDescription is too long (> 155)', () => {
      component.form.controls.metaDescription.setValue('a'.repeat(156));
      expect(component.isValid()).toBe(false);
    });

    it('should be true when both fields have valid lengths', () => {
      component.form.controls.metaTitle.setValue('a'.repeat(50));
      component.form.controls.metaDescription.setValue('a'.repeat(130));
      expect(component.isValid()).toBe(true);
    });
  });

  describe('metadata input', () => {
    it('should pre-fill form from metadata input', async () => {
      const mockMetadata: BlogMetadata = {
        slug: 'test-slug',
        title: 'a'.repeat(50),
        description: 'a'.repeat(130),
      };
      fixture.componentRef.setInput('metadata', mockMetadata);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.controls.metaTitle.value).toBe(mockMetadata.title);
      expect(component.form.controls.metaDescription.value).toBe(mockMetadata.description);
    });
  });

  describe('getValue', () => {
    it('should return only non-empty fields', () => {
      component.form.controls.metaTitle.setValue('a'.repeat(50));
      component.form.controls.metaDescription.setValue('');

      const result = component.getValue();
      expect(result).toEqual({ title: 'a'.repeat(50) });
      expect(result.description).toBeUndefined();
    });

    it('should return empty object when both fields are empty', () => {
      component.form.controls.metaTitle.setValue('');
      component.form.controls.metaDescription.setValue('');

      expect(component.getValue()).toEqual({});
    });

    it('should return both fields when both are non-empty', () => {
      const title = 'a'.repeat(50);
      const desc = 'a'.repeat(130);
      component.form.controls.metaTitle.setValue(title);
      component.form.controls.metaDescription.setValue(desc);

      expect(component.getValue()).toEqual({ title, description: desc });
    });
  });
});
