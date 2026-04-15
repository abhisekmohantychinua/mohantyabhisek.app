import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import type { BlogMetadata } from '../../models/blog-metadata';
import type { BlogMetadataRequest } from '../../models/blog-metadata-request';

@Component({
  selector: 'app-blog-metadata-step',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, TextareaModule],
  templateUrl: './blog-metadata-step.html',
  styleUrl: './blog-metadata-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMetadataStep {
  readonly metadata = input<BlogMetadata>();

  readonly form = new FormGroup({
    metaTitle: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(40), Validators.maxLength(60)],
    }),
    metaDescription: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(120), Validators.maxLength(155)],
    }),
  });

  readonly isValid = computed(() => {
    const title = this.form.controls.metaTitle;
    const desc = this.form.controls.metaDescription;
    const titleOk = !title.value || title.valid;
    const descOk = !desc.value || desc.valid;
    return titleOk && descOk;
  });

  constructor() {
    effect(() => {
      const meta = this.metadata();
      if (meta) {
        this.form.patchValue({
          metaTitle: meta.title,
          metaDescription: meta.description,
        });
      }
    });
  }

  getValue(): BlogMetadataRequest {
    const { metaTitle, metaDescription } = this.form.getRawValue();
    const result: BlogMetadataRequest = {};
    if (metaTitle) {
      result.title = metaTitle;
    }
    if (metaDescription) {
      result.description = metaDescription;
    }
    return result;
  }
}
