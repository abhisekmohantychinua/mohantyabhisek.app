import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../../configs/app-config';
import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryDetailsCard } from './blog-category-details-card';

describe('BlogCategoryDetailsCard', () => {
  let component: BlogCategoryDetailsCard;
  let fixture: ComponentFixture<BlogCategoryDetailsCard>;
  let httpTesting: HttpTestingController;

  const testSlug = 'technology';
  const categoryUrl = `${BASE_URL}/api/blogs/categories/${testSlug}`;
  const mockCategory: BlogCategory = {
    slug: testSlug,
    title: 'Technology',
    description: 'Articles about technology and software.',
    createdAt: '2026-01-01T00:00:00Z',
    lastModifiedAt: '2026-01-02T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryDetailsCard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BlogCategoryDetailsCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', testSlug);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpTesting.expectOne(categoryUrl).flush(mockCategory);

    expect(component).toBeTruthy();
  });

  it('should show a loading state while fetching the category', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading category');

    httpTesting.expectOne(categoryUrl).flush(mockCategory);
  });

  it('should fetch by slug and display the category title and description', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne(categoryUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
    fixture.detectChanges();

    expect(component['category']()).toEqual(mockCategory);
    expect(component['loading']()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Technology');
    expect(fixture.nativeElement.textContent).toContain('Articles about technology and software.');
  });

  it('should show an unavailable state when category lookup fails', () => {
    fixture.detectChanges();
    httpTesting.expectOne(categoryUrl).flush(null, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(component['category']()).toBeUndefined();
    expect(component['loading']()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Category details are unavailable.');
  });

  it('should cancel the category request when destroyed', () => {
    fixture.detectChanges();
    const req = httpTesting.expectOne(categoryUrl);

    fixture.destroy();

    expect(req.cancelled).toBe(true);
  });
});
