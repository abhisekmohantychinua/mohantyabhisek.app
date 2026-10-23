import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { BASE_URL } from '../../../../configs/app-config';
import type { BlogCategory } from '../../models/blog-category';
import { BlogCategories } from './blog-categories';

describe('BlogCategories', () => {
  let component: BlogCategories;
  let fixture: ComponentFixture<BlogCategories>;
  let httpTesting: HttpTestingController;
  const categoriesUrl = `${BASE_URL}/api/blogs/categories`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategories],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BlogCategories);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch and display all categories', () => {
    const categories: BlogCategory[] = [
      {
        slug: 'technology',
        title: 'Technology',
        description: 'Technology articles',
        createdAt: '2026-01-01T00:00:00Z',
        lastModifiedAt: '2026-01-02T00:00:00Z',
      },
    ];

    fixture.detectChanges();

    const req = httpTesting.expectOne(categoriesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(categories);
    fixture.detectChanges();

    expect(component.categories()).toEqual(categories);
    expect(component.loading()).toBe(false);
    expect(fixture.nativeElement.querySelector('app-blog-category-grid')).toBeTruthy();
  });

  it('should show a spinner while categories are loading', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-progressspinner')).toBeTruthy();

    httpTesting.expectOne(categoriesUrl).flush([]);
  });

  it('should stop loading after a request error', () => {
    fixture.detectChanges();

    httpTesting.expectOne(categoriesUrl).error(new ProgressEvent('Network error'));

    expect(component.loading()).toBe(false);
  });

  it('should cancel the categories request when destroyed', () => {
    fixture.detectChanges();
    const req = httpTesting.expectOne(categoriesUrl);

    fixture.destroy();

    expect(req.cancelled).toBe(true);
  });

  it('should create a category from the form submission', () => {
    fixture.detectChanges();
    httpTesting.expectOne(categoriesUrl).flush([]);
    component['createCategory']();

    const request = {
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
    };
    component['submitHandler'](request).subscribe();

    const createRequest = httpTesting.expectOne(categoriesUrl);
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual(request);
    createRequest.flush(null, { status: 201, statusText: 'Created' });
  });

  it('should update the selected category from the form submission', () => {
    fixture.detectChanges();
    httpTesting.expectOne(categoriesUrl).flush([]);

    const category: BlogCategory = {
      slug: 'technology',
      title: 'Technology',
      description: 'Technology articles',
      createdAt: '2026-01-01T00:00:00Z',
      lastModifiedAt: '2026-01-02T00:00:00Z',
    };
    component['editCategory'](category);
    component['submitHandler']({
      slug: category.slug,
      title: 'Technology and Science',
      description: 'Updated category description',
    }).subscribe();

    const updateRequest = httpTesting.expectOne(`${categoriesUrl}/technology`);
    expect(updateRequest.request.method).toBe('PATCH');
    expect(updateRequest.request.body).toEqual({
      title: 'Technology and Science',
      description: 'Updated category description',
    });
    updateRequest.flush(null);
  });
});
