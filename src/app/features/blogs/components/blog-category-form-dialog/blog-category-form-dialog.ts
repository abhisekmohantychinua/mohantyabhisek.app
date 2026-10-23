import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import type { Observable } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import type { BlogCategoryRequest } from '../../models/blog-category-request';

@Component({
  selector: 'app-blog-category-form-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './blog-category-form-dialog.html',
  styleUrl: './blog-category-form-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryFormDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  readonly category = input<BlogCategory>();
  readonly visible = model.required<boolean>();
  readonly submitHandler =
    input.required<(request: BlogCategoryRequest) => Observable<void>>();
  readonly saved = output<void>();

  protected readonly isEditMode = computed(() => this.category() !== undefined);
  protected readonly dialogHeader = computed(() =>
    this.isEditMode() ? 'Edit Blog Category' : 'Create Blog Category',
  );
  protected readonly submitting = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    slug: ['', [Validators.required, Validators.maxLength(100)]],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  constructor() {
    effect(() => {
      if (!this.visible()) {
        return;
      }

      const category = this.category();
      this.form.reset({
        slug: category?.slug ?? '',
        title: category?.title ?? '',
        description: category?.description ?? '',
      });

      if (category) {
        this.form.controls.slug.disable();
      } else {
        this.form.controls.slug.enable();
      }
    });
  }

  protected cancel(): void {
    this.visible.set(false);
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitHandler()(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode()
            ? 'Blog category updated successfully.'
            : 'Blog category created successfully.',
        });
        this.visible.set(false);
        this.saved.emit();
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
