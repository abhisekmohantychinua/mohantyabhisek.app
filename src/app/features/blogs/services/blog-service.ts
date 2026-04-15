import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_URL } from '../../../configs/app-config';
import type { Blog } from '../models/blog';
import type { BlogRequest } from '../models/blog-request';
import type { BlogUpdateRequest } from '../models/blog-update-request';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${BASE_URL}/api/blogs`;

  /**
   * Lists blogs with optional filtering.
   *
   * @param query - Optional substring to match against blog slugs.
   * @param status - Optional filter by blog status.
   * @returns An observable emitting the list of blogs.
   */
  getAllBlogs(query?: string, status?: string): Observable<Blog[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Blog[]>(this.baseUrl, { params });
  }

  /**
   * Gets a single blog by slug.
   *
   * @param slug - The blog slug.
   * @returns An observable emitting the blog.
   */
  getBlogBySlug(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Creates a new blog.
   *
   * @param request - The blog payload to create.
   * @returns An observable that completes on success.
   */
  createBlog(request: BlogRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /**
   * Partially updates a blog by slug.
   *
   * @param slug - The blog slug.
   * @param request - The fields to update.
   * @returns An observable that completes on success.
   */
  updateBlog(slug: string, request: BlogUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}`, request);
  }

  /**
   * Deletes a blog by slug.
   *
   * @param slug - The blog slug.
   * @returns An observable that completes on success.
   */
  deleteBlog(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Publishes a blog by slug.
   *
   * @param slug - The blog slug.
   * @returns An observable that completes on success.
   */
  publishBlog(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/publish`, null);
  }

  /**
   * Unpublishes a blog by slug.
   *
   * @param slug - The blog slug.
   * @returns An observable that completes on success.
   */
  unpublishBlog(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/unpublish`, null);
  }
}
