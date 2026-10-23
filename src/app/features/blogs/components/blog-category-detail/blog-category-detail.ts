import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { Observable, Subscription } from 'rxjs';
import { throwError } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import type { BlogCategoryRequest } from '../../models/blog-category-request';
import { BlogCategoryService } from '../../services/blog-category-service';
import { BlogCategoryFormDialog } from '../blog-category-form-dialog/blog-category-form-dialog';

@Component({
  selector: 'app-blog-category-detail',
  imports: [
    DatePipe,
    ButtonModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    BlogCategoryFormDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './blog-category-detail.html',
  styleUrl: './blog-category-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(BlogCategoryService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly category = signal<BlogCategory | undefined>(undefined);
  protected readonly loading = signal(true);
  protected readonly editDialogVisible = signal(false);

  private categorySubscription?: Subscription;
  private deleteSubscription?: Subscription;

  protected readonly externalUrl = (): string =>
    `https://mohantyabhisek.com/blogs/categories/${this.category()?.slug ?? ''}`;

  protected readonly editHandler = (request: BlogCategoryRequest): Observable<void> => {
    const slug = this.category()?.slug;
    if (!slug) {
      return throwError(() => new Error('Cannot update a category before it has loaded.'));
    }

    return this.categoryService.updateCategory(slug, {
      title: request.title,
      description: request.description,
    });
  };

  ngOnInit(): void {
    this.loadCategory();
  }

  ngOnDestroy(): void {
    this.categorySubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  protected openExternal(): void {
    window.open(this.externalUrl(), '_blank', 'noopener,noreferrer');
  }

  protected openEditDialog(): void {
    this.editDialogVisible.set(true);
  }

  protected onSaved(): void {
    this.loadCategory();
  }

  protected confirmDelete(): void {
    const slug = this.category()?.slug;
    if (!slug) {
      return;
    }

    this.confirmationService.confirm({
      message: 'This action cannot be undone. Are you sure you want to delete this category?',
      header: 'Delete Blog Category',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteSubscription?.unsubscribe();
        this.deleteSubscription = this.categoryService.deleteCategory(slug).subscribe({
          next: () => {
            void this.router.navigate(['/blogs/categories']);
          },
        });
      },
    });
  }

  private loadCategory(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.categorySubscription?.unsubscribe();
    this.categorySubscription = this.categoryService.getCategoryBySlug(slug).subscribe({
      next: (category) => {
        this.category.set(category);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
