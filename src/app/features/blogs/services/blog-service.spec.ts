import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../configs/app-config';
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

  describe('getAllBlogs', () => {
    it('should GET all blogs without params', () => {
      const mockBlogs: Blog[] = [];
      service.getAllBlogs().subscribe((blogs) => {
        expect(blogs).toEqual(mockBlogs);
      });

      const req = httpTesting.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlogs);
    });

    it('should GET blogs with query param', () => {
      service.getAllBlogs('spring').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?query=spring`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('query')).toBe('spring');
      req.flush([]);
    });

    it('should GET blogs with status param', () => {
      service.getAllBlogs(undefined, 'PUBLISHED').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?status=PUBLISHED`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('status')).toBe('PUBLISHED');
      req.flush([]);
    });

    it('should GET blogs with both query and status params', () => {
      service.getAllBlogs('boot', 'UNPUBLISHED').subscribe();

      const req = httpTesting.expectOne(`${baseUrl}?query=boot&status=UNPUBLISHED`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
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
