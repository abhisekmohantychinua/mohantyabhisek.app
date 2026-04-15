import { type ComponentFixture,TestBed } from '@angular/core/testing';

import type { FaqRequest } from '../../models/faq-request';
import { BlogFaqsStep } from './blog-faqs-step';

describe('BlogFaqsStep', () => {
  let component: BlogFaqsStep;
  let fixture: ComponentFixture<BlogFaqsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogFaqsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogFaqsStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have isValid as false initially', () => {
      expect(component.isValid()).toBe(false);
    });

    it('should have empty faqs list', () => {
      expect(component.getValue()).toEqual([]);
    });
  });

  describe('initialFaqs input', () => {
    it('should pre-populate faqs from input', async () => {
      const initial: FaqRequest[] = [
        { question: 'Q1?', answer: 'A1.' },
        { question: 'Q2?', answer: 'A2.' },
      ];
      fixture.componentRef.setInput('initialFaqs', initial);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.getValue()).toEqual(initial);
      expect(component.isValid()).toBe(true);
    });
  });

  describe('addFaq', () => {
    it('should append a valid FAQ and reset the form', () => {
      component['faqForm'].controls.question.setValue('What is Angular?');
      component['faqForm'].controls.answer.setValue('A framework.');

      component['addFaq']();

      expect(component.getValue()).toEqual([
        { question: 'What is Angular?', answer: 'A framework.' },
      ]);
      expect(component['faqForm'].controls.question.value).toBe('');
      expect(component['faqForm'].controls.answer.value).toBe('');
    });

    it('should not add a FAQ when form is invalid and should mark as touched', () => {
      component['faqForm'].controls.question.setValue('');
      component['faqForm'].controls.answer.setValue('');

      component['addFaq']();

      expect(component.getValue()).toEqual([]);
      expect(component['faqForm'].controls.question.touched).toBe(true);
      expect(component['faqForm'].controls.answer.touched).toBe(true);
    });
  });

  describe('editFaq', () => {
    it('should set editingIndex and patch the form with faq at index', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();

      component['editFaq'](0);

      expect(component['editingIndex']()).toBe(0);
      expect(component['faqForm'].controls.question.value).toBe('Q1?');
      expect(component['faqForm'].controls.answer.value).toBe('A1.');
    });
  });

  describe('saveEdit', () => {
    it('should update the FAQ at editingIndex and reset', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();

      component['editFaq'](0);
      component['faqForm'].controls.question.setValue('Updated Q?');
      component['faqForm'].controls.answer.setValue('Updated A.');
      component['saveEdit']();

      expect(component.getValue()).toEqual([{ question: 'Updated Q?', answer: 'Updated A.' }]);
      expect(component['editingIndex']()).toBeNull();
      expect(component['faqForm'].controls.question.value).toBe('');
    });

    it('should not save when form is invalid', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();

      component['editFaq'](0);
      component['faqForm'].controls.question.setValue('');
      component['saveEdit']();

      expect(component.getValue()).toEqual([{ question: 'Q1?', answer: 'A1.' }]);
      expect(component['editingIndex']()).toBe(0);
    });
  });

  describe('cancelEdit', () => {
    it('should reset the form and clear editingIndex', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();

      component['editFaq'](0);
      component['faqForm'].controls.question.setValue('Changed');
      component['cancelEdit']();

      expect(component['editingIndex']()).toBeNull();
      expect(component['faqForm'].controls.question.value).toBe('');
    });
  });

  describe('removeFaq', () => {
    it('should remove the FAQ at the given index', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();
      component['faqForm'].controls.question.setValue('Q2?');
      component['faqForm'].controls.answer.setValue('A2.');
      component['addFaq']();

      component['removeFaq'](0);

      expect(component.getValue()).toEqual([{ question: 'Q2?', answer: 'A2.' }]);
    });
  });

  describe('isValid', () => {
    it('should be true after adding a FAQ', () => {
      component['faqForm'].controls.question.setValue('Q?');
      component['faqForm'].controls.answer.setValue('A.');
      component['addFaq']();

      expect(component.isValid()).toBe(true);
    });
  });

  describe('isEditing', () => {
    it('should return false when not editing', () => {
      expect(component['isEditing']()).toBe(false);
    });

    it('should return true when editing', () => {
      component['faqForm'].controls.question.setValue('Q?');
      component['faqForm'].controls.answer.setValue('A.');
      component['addFaq']();
      component['editFaq'](0);

      expect(component['isEditing']()).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should return the current faqs array', () => {
      component['faqForm'].controls.question.setValue('Q1?');
      component['faqForm'].controls.answer.setValue('A1.');
      component['addFaq']();

      expect(component.getValue()).toEqual([{ question: 'Q1?', answer: 'A1.' }]);
    });
  });
});
