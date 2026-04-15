import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { BlogFormDialog } from './blog-form-dialog';

describe('BlogFormDialog', () => {
  let component: BlogFormDialog;
  let fixture: ComponentFixture<BlogFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFormDialog],
      providers: [MessageService, { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} }],
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
    });
    fixture.detectChanges();
    expect(component['isEditMode']()).toBe(true);
    expect(component['dialogHeader']()).toBe('Edit Blog');
  });

  it('should start at step 1', () => {
    expect(component['activeStep']()).toBe(1);
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
