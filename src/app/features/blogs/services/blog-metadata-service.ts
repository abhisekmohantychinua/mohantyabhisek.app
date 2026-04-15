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
   * Gets metadata for a blog by slug.
   *
   * @param slug - The blog slug.
   * @returns An observable emitting the blog metadata.
   */
  getBlogMetadata(slug: string): Observable<BlogMetadata> {
    return this.http.get<BlogMetadata>(`${this.baseUrl}/${slug}/metadata`);
  }

  /**
   * Partially updates metadata for a blog by slug.
   *
   * @param slug - The blog slug.
   * @param request - The metadata fields to update.
   * @returns An observable that completes on success.
   */
  updateBlogMetadata(slug: string, request: BlogMetadataRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${slug}/metadata`, request);
  }
}
