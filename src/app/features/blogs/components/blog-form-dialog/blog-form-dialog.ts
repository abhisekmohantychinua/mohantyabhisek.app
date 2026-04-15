import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import type { Observable } from 'rxjs';

import type { Blog } from '../../models/blog';
import type { BlogFormData } from '../../models/blog-form-data';
import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogBasicInfoStep } from '../blog-basic-info-step/blog-basic-info-step';
import { BlogContentStep } from '../blog-content-step/blog-content-step';
import { BlogFaqsStep } from '../blog-faqs-step/blog-faqs-step';
import { BlogMetadataStep } from '../blog-metadata-step/blog-metadata-step';
import { BlogTopicsStep } from '../blog-topics-step/blog-topics-step';

@Component({
  selector: 'app-blog-form-dialog',
  imports: [
    DialogModule,
    StepperModule,
    ButtonModule,
    BlogBasicInfoStep,
    BlogTopicsStep,
    BlogFaqsStep,
    BlogContentStep,
    BlogMetadataStep,
  ],
  templateUrl: './blog-form-dialog.html',
  styleUrl: './blog-form-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogFormDialog {
  private readonly messageService = inject(MessageService);

  readonly blog = input<Blog>();
  readonly metadata = input<BlogMetadata>();
  readonly visible = model.required<boolean>();
  readonly submitHandler = input.required<(data: BlogFormData) => Observable<void>>();

  readonly saved = output<void>();

  private readonly basicInfoStep = viewChild(BlogBasicInfoStep);
  private readonly topicsStep = viewChild(BlogTopicsStep);
  private readonly faqsStep = viewChild(BlogFaqsStep);
  private readonly contentStep = viewChild(BlogContentStep);
  private readonly metadataStep = viewChild(BlogMetadataStep);

  protected readonly isEditMode = computed(() => !!this.blog());
  protected readonly dialogHeader = computed(() =>
    this.isEditMode() ? 'Edit Blog' : 'Create Blog',
  );
  protected readonly activeStep = signal(1);
  protected readonly submitting = signal(false);

  protected canProceedFromStep(step: number): boolean {
    switch (step) {
      case 1:
        return this.basicInfoStep()?.form.valid ?? false;
      case 2:
        return this.topicsStep()?.isValid() ?? false;
      case 3:
        return this.faqsStep()?.isValid() ?? false;
      case 4:
        return this.contentStep()?.isValid() ?? false;
      case 5:
        return this.metadataStep()?.isValid() ?? false;
      default:
        return false;
    }
  }

  protected goNext(activateCallback: (step: number) => void): void {
    const current = this.activeStep();
    if (this.canProceedFromStep(current)) {
      const next = current + 1;
      this.activeStep.set(next);
      activateCallback(next);
    } else {
      this.markCurrentStepTouched(current);
    }
  }

  protected goBack(activateCallback: (step: number) => void): void {
    const prev = this.activeStep() - 1;
    this.activeStep.set(prev);
    activateCallback(prev);
  }

  protected onStepChange(step: number): void {
    this.activeStep.set(step);
  }

  protected cancel(): void {
    this.visible.set(false);
  }

  protected submit(): void {
    if (!this.canProceedFromStep(5)) {
      this.markCurrentStepTouched(5);
      return;
    }

    const metaValue = this.metadataStep()!.getValue();
    const data: BlogFormData = {
      ...this.basicInfoStep()!.getValue(),
      topics: this.topicsStep()!.getValue(),
      faqs: this.faqsStep()!.getValue(),
      content: this.contentStep()!.getValue(),
      metaTitle: metaValue.title ?? '',
      metaDescription: metaValue.description ?? '',
    };

    this.submitting.set(true);
    this.submitHandler()(data).subscribe({
      next: () => {
        this.submitting.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode() ? 'Blog updated successfully.' : 'Blog created successfully.',
        });
        this.visible.set(false);
        this.saved.emit();
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  private markCurrentStepTouched(step: number): void {
    if (step === 1) {
      this.basicInfoStep()?.form.markAllAsTouched();
    }
    if (step === 5) {
      this.metadataStep()?.form.markAllAsTouched();
    }
  }
}
