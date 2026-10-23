import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_URL } from '../../../configs/app-config';
import type { Blog } from '../models/blog';
import type { BlogCategory } from '../models/blog-category';
import type { BlogCategoryRequest } from '../models/blog-category-request';
import type { BlogCategoryUpdateRequest } from '../models/blog-category-update-request';

@Injectable({
  providedIn: 'root',
})
export class BlogCategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${BASE_URL}/api/blogs/categories`;

  /**
   * Retrieves all blog categories ordered by title.
   *
   * @returns An observable emitting the complete category list.
   */
  listCategories(): Observable<BlogCategory[]> {
    return this.http.get<BlogCategory[]>(this.baseUrl);
  }

  /**
   * Creates a category using the provided request body.
   *
   * @param request - The category fields to create.
   * @returns An observable that completes when the category is created.
   */
  createCategory(request: BlogCategoryRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /**
   * Retrieves a category by its exact slug.
   *
   * @param slug - The exact category slug.
   * @returns An observable emitting the matching category.
   */
  getCategoryBySlug(slug: string): Observable<BlogCategory> {
    return this.http.get<BlogCategory>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Retrieves all blogs assigned to a category by its exact slug.
   *
   * @param slug - The exact category slug.
   * @returns An observable emitting the category's blogs.
   */
  listBlogsByCategory(slug: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}/${slug}/blogs`);
  }

  /**
   * Deletes a category by its exact slug.
   *
   * @param slug - The exact category slug.
   * @returns An observable that completes when the category is deleted.
   */
  deleteCategory(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Partially updates the title or description of a category.
   *
   * @param slug - The exact category slug.
   * @param request - The category fields to update.
   * @returns An observable that completes when the category is updated.
   */
  updateCategory(slug: string, request: BlogCategoryUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}`, request);
  }
}
