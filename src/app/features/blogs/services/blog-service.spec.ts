import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../configs/app-config';
import type PageResponse from '../../../models/page-response';
import type { Blog } from '../models/blog';
import type { BlogRequest } from '../models/blog-request';
import type { BlogUpdateRequest } from '../models/blog-update-request';
import { BlogService } from './blog-service';

describe('BlogService', () => {
  let service: BlogService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${BASE_URL}/api/blogs`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listBlogs', () => {
    it('should GET paginated blogs with default index', () => {
      const mockResponse: PageResponse<Blog> = {
        items: [],
        currentIndex: 0,
        isLastIndex: true,
      };

      service.listBlogs().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTesting.expectOne(`${baseUrl}?index=0`);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('index')).toBe('0');

      req.flush(mockResponse);
    });

    it('should GET blogs with query param', () => {
      service.listBlogs('spring').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?query=spring&index=0`);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('query')).toBe('spring');
      expect(req.request.params.get('index')).toBe('0');

      req.flush({
        items: [],
        currentIndex: 0,
        isLastIndex: true,
      });
    });

    it('should GET blogs with status param', () => {
      service.listBlogs(undefined, 'PUBLISHED').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?status=PUBLISHED&index=0`);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('status')).toBe('PUBLISHED');
      expect(req.request.params.get('index')).toBe('0');

      req.flush({
        items: [],
        currentIndex: 0,
        isLastIndex: true,
      });
    });

    it('should GET blogs with query, status, and index params', () => {
      service.listBlogs('boot', 'UNPUBLISHED', 2).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?query=boot&status=UNPUBLISHED&index=2`);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('query')).toBe('boot');
      expect(req.request.params.get('status')).toBe('UNPUBLISHED');
      expect(req.request.params.get('index')).toBe('2');

      req.flush({
        items: [],
        currentIndex: 2,
        isLastIndex: false,
      });
    });

    it('should fallback to index 0 when index is negative', () => {
      service.listBlogs(undefined, undefined, -1).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?index=0`);

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('index')).toBe('0');

      req.flush({
        items: [],
        currentIndex: 0,
        isLastIndex: true,
      });
    });
  });

  describe('getBlogBySlug', () => {
    it('should GET a blog by slug', () => {
      const mockBlog = { slug: 'my-blog' } as Blog;
      service.getBlogBySlug('my-blog').subscribe((blog) => {
        expect(blog).toEqual(mockBlog);
      });

      const req = httpTesting.expectOne(`${baseUrl}/my-blog`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlog);
    });
  });

  describe('createBlog', () => {
    it('should POST a new blog', () => {
      const request: BlogRequest = {
        slug: 'new-blog',
        title: 'New Blog',
        description: 'Description',
        topics: ['angular'],
        faqs: [{ question: 'Q?', answer: 'A.' }],
        content: 'Content',
      };

      service.createBlog(request).subscribe();

      const req = httpTesting.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(null, { status: 201, statusText: 'Created' });
    });
  });

  describe('updateBlog', () => {
    it('should PATCH a blog by slug', () => {
      const request: BlogUpdateRequest = { title: 'Updated' };

      service.updateBlog('my-blog', request).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/my-blog`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(request);
      req.flush(null);
    });
  });

  describe('deleteBlog', () => {
    it('should DELETE a blog by slug', () => {
      service.deleteBlog('my-blog').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/my-blog`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('publishBlog', () => {
    it('should PATCH publish a blog by slug', () => {
      service.publishBlog('my-blog').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/my-blog/publish`);
      expect(req.request.method).toBe('PATCH');
      req.flush(null);
    });
  });

  describe('unpublishBlog', () => {
    it('should PATCH unpublish a blog by slug', () => {
      service.unpublishBlog('my-blog').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/my-blog/unpublish`);
      expect(req.request.method).toBe('PATCH');
      req.flush(null);
    });
  });
});
