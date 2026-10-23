import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../configs/app-config';
import type { Blog } from '../models/blog';
import type { BlogCategory } from '../models/blog-category';
import type { BlogCategoryRequest } from '../models/blog-category-request';
import type { BlogCategoryUpdateRequest } from '../models/blog-category-update-request';
import { BlogCategoryService } from './blog-category-service';

describe('BlogCategoryService', () => {
  let service: BlogCategoryService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${BASE_URL}/api/blogs/categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BlogCategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should GET all categories', () => {
    const categories: BlogCategory[] = [
      {
        slug: 'technology',
        title: 'Technology',
        description: 'Technology articles',
        createdAt: '2026-01-01T00:00:00Z',
        lastModifiedAt: '2026-01-02T00:00:00Z',
      },
    ];

    service.listCategories().subscribe((response) => {
      expect(response).toEqual(categories);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(categories);
  });

  it('should POST a category', () => {
    const request: BlogCategoryRequest = {
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    };

    service.createCategory(request).subscribe();

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(null, { status: 201, statusText: 'Created' });
  });

  it('should GET a category by slug', () => {
    const category: BlogCategory = {
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
      createdAt: '2026-01-01T00:00:00Z',
      lastModifiedAt: '2026-01-02T00:00:00Z',
    };

    service.getCategoryBySlug('technology').subscribe((response) => {
      expect(response).toEqual(category);
    });

    const req = httpTesting.expectOne(`${baseUrl}/technology`);
    expect(req.request.method).toBe('GET');
    req.flush(category);
  });

  it('should GET blogs assigned to a category by slug', () => {
    const blogs: Blog[] = [
      {
        slug: 'angular-signals',
        title: 'Angular Signals',
        description: 'An introduction to signals',
        status: 'PUBLISHED',
        postedAt: '2026-01-01T00:00:00Z',
        lastModifiedAt: '2026-01-02T00:00:00Z',
        topics: [],
        faqs: [],
        content: '',
        blogCategorySlug: 'technology',
      },
    ];

    service.listBlogsByCategory('technology').subscribe((response) => {
      expect(response).toEqual(blogs);
    });

    const req = httpTesting.expectOne(`${baseUrl}/technology/blogs`);
    expect(req.request.method).toBe('GET');
    req.flush(blogs);
  });

  it('should DELETE a category by slug', () => {
    service.deleteCategory('technology').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/technology`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should PATCH a category by slug', () => {
    const request: BlogCategoryUpdateRequest = { title: 'Technology and Science' };

    service.updateCategory('technology', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/technology`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });
});
