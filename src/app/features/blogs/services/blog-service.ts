import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_URL } from '../../../configs/app-config';
import type PageResponse from '../../../models/page-response';
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
   * Fetches a paginated list of blogs from the server using
   * index-based pagination.
   *
   * @param query - Optional case-insensitive substring matched against blog slugs.
   *   When omitted, all slugs are matched.
   *
   * @param status - Optional blog status filter (`PUBLISHED` or `UNPUBLISHED`).
   *   When omitted, blogs of every status are included.
   *
   * @param index - Optional zero-based pagination index.
   *   Each index represents a fixed-size result window.
   *   Invalid or negative values automatically fallback to `0`.
   *
   * @returns An observable emitting a paginated blog response.
   *
   * @remarks
   * **API behavior** (`GET /api/blogs`)
   *
   * - Blogs are filtered using a case-insensitive slug match.
   * - Results are sorted by `lastModifiedAt` in descending order.
   * - Pagination uses fixed-size index-based windows.
   * - The response includes:
   *   - `items` → blogs for the requested index
   *   - `currentIndex` → current pagination index
   *   - `isLastIndex` → indicates whether more pages exist
   */
  listBlogs(query?: string, status?: string, index?: number): Observable<PageResponse<Blog>> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (!index || index < 0) {
      index = 0; // Fallback to zero if index isn't provided or negative
    }
    params = params.set('index', index);
    return this.http.get<PageResponse<Blog>>(this.baseUrl, { params });
  }

  /**
   * Retrieves a single blog identified by its unique slug.
   *
   * @param slug - The exact slug of the blog to retrieve.
   * @returns An observable emitting the full blog entity.
   *
   * @remarks
   * **API behavior** (`GET /api/blogs/{slug}`): Loads one blog by exact slug
   * and returns it as a response DTO. If no blog exists for the provided slug,
   * fails with 404 Not Found.
   */
  getBlogBySlug(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Sends a request to create a new blog from the provided payload.
   *
   * @param request - The blog content including title, description, content,
   *   topics, and FAQs.
   * @returns An observable that completes when the blog is created.
   *
   * @remarks
   * **API behavior** (`POST /api/blogs`): Creates a new blog document with
   * `schemaVersion` 1, stores title/description/content/topics/FAQs from the
   * request, sets status to `UNPUBLISHED`, and initialises `lastModifiedAt`
   * with the current timestamp. After a successful save, a matching metadata
   * record is also created for the same slug.
   *
   * - Slug conflict → 409 Conflict.
   * - Schema validation failure → 400 Bad Request.
   */
  createBlog(request: BlogRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  /**
   * Partially updates an existing blog, applying only the provided fields.
   *
   * @param slug - The exact slug of the blog to update.
   * @param request - A sparse object whose non-null, non-blank fields are
   *   applied to the blog.
   * @returns An observable that completes when the update is persisted.
   *
   * @remarks
   * **API behavior** (`PATCH /api/blogs/{slug}`): Only non-null and non-blank
   * fields are applied. Topics and FAQs are applied only when non-empty; FAQs
   * are remapped from request DTOs. When at least one field changes,
   * `lastModifiedAt` is refreshed to the current timestamp. If no effective
   * fields are provided the operation is a no-op and returns success.
   *
   * - Missing slug → 404 Not Found.
   * - Schema validation failure → 400 Bad Request.
   */
  updateBlog(slug: string, request: BlogUpdateRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}`, request);
  }

  /**
   * Permanently deletes a blog and its associated metadata.
   *
   * @param slug - The exact slug of the blog to delete.
   * @returns An observable that completes when the blog is removed.
   *
   * @remarks
   * **API behavior** (`DELETE /api/blogs/{slug}`): Deletes the blog by slug.
   * When blog deletion succeeds, the associated metadata record is also
   * deleted. If no blog exists for the slug → 404 Not Found.
   */
  deleteBlog(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${slug}`);
  }

  /**
   * Transitions a blog from `UNPUBLISHED` to `PUBLISHED` status.
   *
   * @param slug - The exact slug of the blog to publish.
   * @returns An observable that completes when the blog is published.
   *
   * @remarks
   * **API behavior** (`PATCH /api/blogs/{slug}/publish`): Changes status from
   * `UNPUBLISHED` to `PUBLISHED` and sets both `postedAt` and
   * `lastModifiedAt` to the current timestamp.
   *
   * - Missing slug → 404 Not Found.
   * - Already published → 409 Conflict.
   */
  publishBlog(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/publish`, null);
  }

  /**
   * Transitions a blog from `PUBLISHED` to `UNPUBLISHED` status.
   *
   * @param slug - The exact slug of the blog to unpublish.
   * @returns An observable that completes when the blog is unpublished.
   *
   * @remarks
   * **API behavior** (`PATCH /api/blogs/{slug}/unpublish`): Changes status
   * from `PUBLISHED` to `UNPUBLISHED`.
   *
   * - Missing slug → 404 Not Found.
   * - Already unpublished → 409 Conflict.
   */
  unpublishBlog(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/unpublish`, null);
  }
}
