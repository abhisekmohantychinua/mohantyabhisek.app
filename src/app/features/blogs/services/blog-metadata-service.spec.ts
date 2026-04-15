import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../configs/app-config';
import type { BlogMetadata } from '../models/blog-metadata';
import type { BlogMetadataRequest } from '../models/blog-metadata-request';
import { BlogMetadataService } from './blog-metadata-service';

describe('BlogMetadataService', () => {
  let service: BlogMetadataService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${BASE_URL}/api/blogs`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogMetadataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBlogMetadata', () => {
    it('should GET metadata by slug', () => {
      const mockMetadata: BlogMetadata = {
        slug: 'my-blog',
        title: 'My Blog Title',
        description: 'My blog description',
      };

      service.getBlogMetadata('my-blog').subscribe((metadata) => {
        expect(metadata).toEqual(mockMetadata);
      });

      const req = httpTesting.expectOne(`${baseUrl}/my-blog/metadata`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMetadata);
    });
  });

  describe('updateBlogMetadata', () => {
    it('should PATCH metadata by slug', () => {
      const request: BlogMetadataRequest = { title: 'Updated SEO Title That Is Long Enough' };

      service.updateBlogMetadata('my-blog', request).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/my-blog/metadata`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(request);
      req.flush(null);
    });
  });
});
