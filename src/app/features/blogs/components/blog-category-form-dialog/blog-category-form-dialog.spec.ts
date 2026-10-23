import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import type { BlogCategoryRequest } from '../../models/blog-category-request';
import { BlogCategoryFormDialog } from './blog-category-form-dialog';

const mockCategory: BlogCategory = {
  slug: 'technology',
  title: 'Technology',
  description: 'Technology articles',
  createdAt: '2026-01-01T00:00:00Z',
  lastModifiedAt: '2026-01-02T00:00:00Z',
};

describe('BlogCategoryFormDialog', () => {
  let component: BlogCategoryFormDialog;
  let fixture: ComponentFixture<BlogCategoryFormDialog>;
  let submitHandler: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submitHandler = vi.fn(() => of(undefined));

    await TestBed.configureTestingModule({
      imports: [BlogCategoryFormDialog],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCategoryFormDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('submitHandler', submitHandler);
  });

  it('should initialize the create form with an editable slug', () => {
    fixture.detectChanges();

    expect(component['isEditMode']()).toBe(false);
    expect(component['form'].controls.slug.enabled).toBe(true);
    expect(component['dialogHeader']()).toBe('Create Blog Category');
  });

  it('should submit the create request and emit saved', () => {
    fixture.detectChanges();
    component['form'].setValue({
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    });
    const savedSpy = vi.spyOn(component.saved, 'emit');

    component['submit']();

    expect(submitHandler).toHaveBeenCalledWith({
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    } satisfies BlogCategoryRequest);
    expect(component.visible()).toBe(false);
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should populate edit values and keep the slug immutable', () => {
    fixture.componentRef.setInput('category', mockCategory);
    fixture.detectChanges();

    expect(component['isEditMode']()).toBe(true);
    expect(component['form'].getRawValue()).toEqual({
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    });
    expect(component['form'].controls.slug.disabled).toBe(true);
  });

  it('should reject invalid form values without submitting', () => {
    fixture.detectChanges();

    component['submit']();

    expect(component['form'].touched).toBe(true);
    expect(submitHandler).not.toHaveBeenCalled();
  });

  it('should unsubscribe from the submit request when destroyed', () => {
    const unsubscribe = vi.fn();
    const pendingRequest = new Observable<void>((): (() => void) => () => {
      unsubscribe();
    });
    fixture.componentRef.setInput('submitHandler', () => pendingRequest);
    fixture.detectChanges();
    component['form'].setValue({
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    });

    component['submit']();
    fixture.destroy();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
