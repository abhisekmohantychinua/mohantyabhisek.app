import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_URL } from '../../../configs/app-config';
import type { BlogMetadata } from '../models/blog-metadata';
import type { BlogMetadataRequest } from '../models/blog-metadata-request';

@Injectable({
  providedIn: 'root',
})
export class BlogMetadataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${BASE_URL}/api/blogs`;

  /**
   * Retrieves SEO metadata (slug, title, description) for a blog.
   *
   * @param slug - The exact slug of the blog whose metadata is requested.
   * @returns An observable emitting the blog metadata.
   *
   * @remarks
   * **API behavior** (`GET /api/blogs/{slug}/metadata`): Loads the metadata
   * record by exact blog slug and returns slug, title, and description. If no
   * metadata exists for the provided slug → 404 Not Found.
   */
  getBlogMetadata(slug: string): Observable<BlogMetadata> {
    return this.http.get<BlogMetadata>(`${this.baseUrl}/${slug}/metadata`);
  }

  /**
   * Partially updates SEO metadata for a blog, applying only provided fields.
   *
   * @param slug - The exact slug of the blog whose metadata is being updated.
   * @param request - A sparse object whose non-null, non-empty title and
   *   description values are applied; missing or empty values are ignored.
   * @returns An observable that completes when the metadata is persisted.
   *
   * @remarks
   * **API behavior** (`PATCH /api/blogs/{slug}/metadata`): Only non-null and
   * non-empty title/description values are applied; missing or empty values
   * are ignored. The current metadata record is then saved. If metadata does
   * not exist for the slug → 404 Not Found.
   */
  updateBlogMetadata(slug: string, request: BlogMetadataRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/metadata`, request);
  }
}
