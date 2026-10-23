import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { Observable, Subscription } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import type { BlogCategoryRequest } from '../../models/blog-category-request';
import { BlogCategoryService } from '../../services/blog-category-service';
import { BlogCategoryFormDialog } from '../blog-category-form-dialog/blog-category-form-dialog';
import { BlogCategoryGrid } from '../blog-category-grid/blog-category-grid';

@Component({
  selector: 'app-blog-categories',
  imports: [ButtonModule, ProgressSpinnerModule, BlogCategoryGrid, BlogCategoryFormDialog],
  templateUrl: './blog-categories.html',
  styleUrl: './blog-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategories implements OnInit, OnDestroy {
  private readonly categoryService = inject(BlogCategoryService);
  private categoriesSubscription?: Subscription;

  readonly categories = signal<BlogCategory[]>([]);
  readonly loading = signal(true);
  readonly formDialogVisible = signal(false);

  protected readonly submitHandler = (request: BlogCategoryRequest): Observable<void> =>
    this.categoryService.createCategory(request);

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }

  protected createCategory(): void {
    this.formDialogVisible.set(true);
  }

  protected onSaved(): void {
    this.loadCategories(false);
  }

  private loadCategories(showLoading = true): void {
    if (showLoading) {
      this.loading.set(true);
    }

    this.categoriesSubscription?.unsubscribe();
    this.categoriesSubscription = this.categoryService.listCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
