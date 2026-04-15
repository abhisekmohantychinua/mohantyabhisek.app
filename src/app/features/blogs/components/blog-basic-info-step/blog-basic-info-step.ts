import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import type { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-basic-info-step',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, TextareaModule],
  templateUrl: './blog-basic-info-step.html',
  styleUrl: './blog-basic-info-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogBasicInfoStep {
  readonly blog = input<Blog>();
  readonly isEditMode = input(false);

  protected readonly showSlug = computed(() => !this.isEditMode());

  readonly form = new FormGroup({
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
    }),
  });

  constructor() {
    effect(() => {
      const blog = this.blog();
      if (blog) {
        this.form.patchValue({
          slug: blog.slug,
          title: blog.title,
          description: blog.description,
        });
      }
    });

    effect(() => {
      if (this.isEditMode()) {
        this.form.controls.slug.disable();
      } else {
        this.form.controls.slug.enable();
      }
    });
  }

  getValue(): { slug: string; title: string; description: string } {
    return this.form.getRawValue();
  }
}
