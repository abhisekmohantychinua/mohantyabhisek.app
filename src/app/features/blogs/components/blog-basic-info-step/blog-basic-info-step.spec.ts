import { type ComponentFixture,TestBed } from '@angular/core/testing';

import type { Blog } from '../../models/blog';
import { BlogBasicInfoStep } from './blog-basic-info-step';

describe('BlogBasicInfoStep', () => {
  let component: BlogBasicInfoStep;
  let fixture: ComponentFixture<BlogBasicInfoStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogBasicInfoStep],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogBasicInfoStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should start with an invalid form (all empty)', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should become valid when all fields are filled', () => {
      component.form.controls.slug.setValue('my-slug');
      component.form.controls.title.setValue('My Title');
      component.form.controls.description.setValue('My description');

      expect(component.form.valid).toBe(true);
    });

    describe('slug field', () => {
      it('should be required', () => {
        const slug = component.form.controls.slug;
        slug.setValue('');
        expect(slug.hasError('required')).toBe(true);
      });

      it('should enforce maxLength of 200', () => {
        const slug = component.form.controls.slug;
        slug.setValue('a'.repeat(201));
        expect(slug.hasError('maxlength')).toBe(true);
      });

      it('should accept value at maxLength boundary', () => {
        const slug = component.form.controls.slug;
        slug.setValue('a'.repeat(200));
        expect(slug.hasError('maxlength')).toBe(false);
      });
    });

    describe('title field', () => {
      it('should be required', () => {
        const title = component.form.controls.title;
        title.setValue('');
        expect(title.hasError('required')).toBe(true);
      });

      it('should enforce maxLength of 200', () => {
        const title = component.form.controls.title;
        title.setValue('a'.repeat(201));
        expect(title.hasError('maxlength')).toBe(true);
      });
    });

    describe('description field', () => {
      it('should be required', () => {
        const desc = component.form.controls.description;
        desc.setValue('');
        expect(desc.hasError('required')).toBe(true);
      });

      it('should enforce maxLength of 500', () => {
        const desc = component.form.controls.description;
        desc.setValue('a'.repeat(501));
        expect(desc.hasError('maxlength')).toBe(true);
      });
    });
  });

  describe('blog input', () => {
    it('should pre-fill the form when blog input is set', async () => {
      const mockBlog = {
        slug: 'test-slug',
        title: 'Test Title',
        description: 'Test Description',
      } as Blog;

      fixture.componentRef.setInput('blog', mockBlog);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.controls.slug.value).toBe('test-slug');
      expect(component.form.controls.title.value).toBe('Test Title');
      expect(component.form.controls.description.value).toBe('Test Description');
    });
  });

  describe('edit mode', () => {
    it('should disable slug control in edit mode', async () => {
      fixture.componentRef.setInput('isEditMode', true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.controls.slug.disabled).toBe(true);
    });

    it('should enable slug control in create mode', async () => {
      fixture.componentRef.setInput('isEditMode', false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.controls.slug.enabled).toBe(true);
    });

    it('should return false for showSlug in edit mode', async () => {
      fixture.componentRef.setInput('isEditMode', true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component['showSlug']()).toBe(false);
    });

    it('should return true for showSlug in create mode', async () => {
      fixture.componentRef.setInput('isEditMode', false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component['showSlug']()).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should return raw form values including disabled slug', async () => {
      fixture.componentRef.setInput('isEditMode', true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.form.controls.slug.setValue('my-slug');
      component.form.controls.title.setValue('My Title');
      component.form.controls.description.setValue('My Description');

      const value = component.getValue();
      expect(value).toEqual({
        slug: 'my-slug',
        title: 'My Title',
        description: 'My Description',
      });
    });
  });
});
