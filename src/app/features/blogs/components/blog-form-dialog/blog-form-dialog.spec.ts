import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { MessageService } from 'primeng/api';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryService } from '../../services/blog-category-service';
import { BlogFormDialog } from './blog-form-dialog';

describe('BlogFormDialog', () => {
  let component: BlogFormDialog;
  let fixture: ComponentFixture<BlogFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFormDialog],
      providers: [
        MessageService,
        { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} },
        {
          provide: BlogCategoryService,
          useValue: { listCategories: (): Observable<BlogCategory[]> => of([]) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFormDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('submitHandler', () => of(undefined));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to create mode', () => {
    expect(component['isEditMode']()).toBe(false);
    expect(component['dialogHeader']()).toBe('Create Blog');
  });

  it('should set edit mode when blog input provided', () => {
    fixture.componentRef.setInput('blog', {
      slug: 'test',
      title: 'Test',
      description: 'Desc',
      status: 'PUBLISHED',
      postedAt: '',
      lastModifiedAt: '',
      topics: [],
      faqs: [],
      content: '',
      blogCategorySlug: 'technology',
    });
    fixture.detectChanges();
    expect(component['isEditMode']()).toBe(true);
    expect(component['dialogHeader']()).toBe('Edit Blog');
  });

  it('should start at step 1', () => {
    expect(component['activeStep']()).toBe(1);
  });

  it('should allow progressing through the optional category step', () => {
    expect(component['canProceedFromStep'](2)).toBe(true);
  });

  it('should place the category step after basic info and before topics', () => {
    const stepLabels = Array.from(
      fixture.nativeElement.querySelectorAll('p-step'),
      (element: Element) => element.textContent?.replace(/^\d+/, '').trim(),
    );

    expect(stepLabels).toEqual(['Basic Info', 'Category', 'Topics', 'FAQs', 'Content', 'Metadata']);
  });

  it('should update activeStep on onStepChange', () => {
    component['onStepChange'](3);
    expect(component['activeStep']()).toBe(3);
  });

  it('should close dialog on cancel', () => {
    component['cancel']();
    expect(component.visible()).toBe(false);
  });
});
