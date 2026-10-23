import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import type { Subscription } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryService } from '../../services/blog-category-service';

@Component({
  selector: 'app-blog-category-step',
  imports: [ReactiveFormsModule, SelectModule],
  templateUrl: './blog-category-step.html',
  styleUrl: './blog-category-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryStep implements OnInit, OnDestroy {
  private readonly categoryService = inject(BlogCategoryService);
  private categoriesSubscription?: Subscription;

  readonly initialCategorySlug = input<string>();
  readonly categories = signal<BlogCategory[]>([]);
  readonly loading = signal(true);
  readonly loadFailed = signal(false);
  readonly categorySlugControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    // The update API has no null/clear representation, so an existing
    // category can be changed but not removed here.
    this.categorySlugControl.setValue(this.initialCategorySlug() ?? null, {
      emitEvent: false,
    });

    this.categoriesSubscription = this.categoryService.listCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }

  getValue(): string | undefined {
    return this.categorySlugControl.value ?? undefined;
  }
}
