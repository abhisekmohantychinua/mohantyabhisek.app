import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import type { FaqRequest } from '../../models/faq-request';

@Component({
  selector: 'app-blog-faqs-step',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './blog-faqs-step.html',
  styleUrl: './blog-faqs-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFaqsStep {
  readonly initialFaqs = input<FaqRequest[]>();

  protected readonly faqs = signal<FaqRequest[]>([]);
  protected readonly editingIndex = signal<number | null>(null);

  protected readonly faqForm = new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
    }),
  });

  readonly isValid = computed(() => this.faqs().length >= 1);

  protected readonly isEditing = computed(() => this.editingIndex() !== null);

  constructor() {
    effect(() => {
      const initial = this.initialFaqs();
      if (initial?.length) {
        this.faqs.set([...initial]);
      }
    });
  }

  protected addFaq(): void {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    const value = this.faqForm.getRawValue();
    this.faqs.update((faqs) => [...faqs, value]);
    this.faqForm.reset();
  }

  protected editFaq(index: number): void {
    const faq = this.faqs()[index];
    this.faqForm.patchValue(faq);
    this.editingIndex.set(index);
  }

  protected saveEdit(): void {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    const index = this.editingIndex();
    if (index === null) return;

    const value = this.faqForm.getRawValue();
    this.faqs.update((faqs) => faqs.map((f, i) => (i === index ? value : f)));
    this.editingIndex.set(null);
    this.faqForm.reset();
  }

  protected cancelEdit(): void {
    this.editingIndex.set(null);
    this.faqForm.reset();
  }

  protected removeFaq(index: number): void {
    this.faqs.update((faqs) => faqs.filter((_, i) => i !== index));
    if (this.editingIndex() === index) {
      this.cancelEdit();
    }
  }

  getValue(): FaqRequest[] {
    return this.faqs();
  }
}
