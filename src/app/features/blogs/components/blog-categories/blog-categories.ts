import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { Observable } from 'rxjs';

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
export class BlogCategories implements OnInit {
  private readonly categoryService = inject(BlogCategoryService);

  readonly categories = signal<BlogCategory[]>([]);
  readonly loading = signal(true);
  readonly formDialogVisible = signal(false);
  readonly selectedCategory = signal<BlogCategory | undefined>(undefined);

  protected readonly submitHandler = (request: BlogCategoryRequest): Observable<void> => {
    const category = this.selectedCategory();
    if (category) {
      return this.categoryService.updateCategory(category.slug, {
        title: request.title,
        description: request.description,
      });
    }
    return this.categoryService.createCategory(request);
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  protected createCategory(): void {
    this.selectedCategory.set(undefined);
    this.formDialogVisible.set(true);
  }

  protected editCategory(category: BlogCategory): void {
    this.selectedCategory.set(category);
    this.formDialogVisible.set(true);
  }

  protected onSaved(): void {
    this.selectedCategory.set(undefined);
    this.loadCategories(false);
  }

  private loadCategories(showLoading = true): void {
    if (showLoading) {
      this.loading.set(true);
    }

    this.categoryService.listCategories().subscribe({
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
