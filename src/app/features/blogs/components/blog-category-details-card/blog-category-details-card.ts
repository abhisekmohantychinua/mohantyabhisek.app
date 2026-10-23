import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import type { Subscription } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryService } from '../../services/blog-category-service';

@Component({
  selector: 'app-blog-category-details-card',
  templateUrl: './blog-category-details-card.html',
  styleUrl: './blog-category-details-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryDetailsCard implements OnInit, OnDestroy {
  private readonly categoryService = inject(BlogCategoryService);
  private categorySubscription?: Subscription;

  readonly slug = input.required<string>();

  protected readonly category = signal<BlogCategory | undefined>(undefined);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategoryBySlug(this.slug()).subscribe({
      next: (category) => {
        this.category.set(category);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.categorySubscription?.unsubscribe();
  }
}
