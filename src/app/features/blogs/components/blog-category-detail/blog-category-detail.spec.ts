import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BASE_URL } from '../../../../configs/app-config';
import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryDetail } from './blog-category-detail';

describe('BlogCategoryDetail', () => {
  let component: BlogCategoryDetail;
  let fixture: ComponentFixture<BlogCategoryDetail>;
  let httpTesting: HttpTestingController;
  let router: Router;

  const categorySlug = 'technology';
  const categoryUrl = `${BASE_URL}/api/blogs/categories/${categorySlug}`;
  const mockCategory: BlogCategory = {
    slug: categorySlug,
    title: 'Technology',
    description: 'Technology articles',
    createdAt: '2026-01-01T12:00:00Z',
    lastModifiedAt: '2026-02-01T12:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (): string => categorySlug } } },
        },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BlogCategoryDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load and display category details', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne(categoryUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
    fixture.detectChanges();

    expect(component['category']()).toEqual(mockCategory);
    expect(component['loading']()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Technology');
    expect(fixture.nativeElement.textContent).toContain('Technology articles');
    expect(fixture.nativeElement.textContent).toContain('Created:');
    expect(fixture.nativeElement.textContent).toContain('Modified:');
  });

  it('should show loading state before the category is loaded', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-progressspinner')).toBeTruthy();

    httpTesting.expectOne(categoryUrl).flush(mockCategory);
  });

  it('should open the public category URL in a new tab', () => {
    component['category'].set(mockCategory);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component['openExternal']();

    expect(openSpy).toHaveBeenCalledWith(
      'https://mohantyabhisek.com/blogs/categories/technology',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should edit the loaded category and reload after save', () => {
    fixture.detectChanges();
    httpTesting.expectOne(categoryUrl).flush(mockCategory);
    component['category'].set(mockCategory);

    component['editHandler']({
      slug: categorySlug,
      title: 'Technology and Science',
      description: 'Updated description',
    }).subscribe();

    const updateRequest = httpTesting.expectOne(categoryUrl);
    expect(updateRequest.request.method).toBe('PATCH');
    expect(updateRequest.request.body).toEqual({
      title: 'Technology and Science',
      description: 'Updated description',
    });
    updateRequest.flush(null);

    component['onSaved']();
    httpTesting.expectOne(categoryUrl).flush({
      ...mockCategory,
      title: 'Technology and Science',
    });
    expect(component['category']()?.title).toBe('Technology and Science');
  });

  it('should confirm deletion and navigate back to categories', () => {
    component['category'].set(mockCategory);
    const confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    const confirmSpy = vi.spyOn(confirmationService, 'confirm');
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component['confirmDelete']();

    expect(confirmSpy).toHaveBeenCalledOnce();
    const confirmation = confirmSpy.mock.calls[0][0];
    confirmation.accept?.();

    const req = httpTesting.expectOne(categoryUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(navigateSpy).toHaveBeenCalledWith(['/blogs/categories']);
  });

  it('should unsubscribe the pending category request on destroy', () => {
    fixture.detectChanges();
    const req = httpTesting.expectOne(categoryUrl);

    fixture.destroy();

    expect(req.cancelled).toBe(true);
  });
});
