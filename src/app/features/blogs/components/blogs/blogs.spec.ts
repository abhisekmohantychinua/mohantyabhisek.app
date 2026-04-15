import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BASE_URL } from '../../../../configs/app-config';
import type { Blog } from '../../models/blog';
import { Blogs } from './blogs';

const mockBlogs: Blog[] = [
  {
    slug: 'blog-one',
    title: 'Blog One',
    description: 'Description one',
    status: 'PUBLISHED',
    postedAt: '2026-01-01T00:00:00Z',
    lastModifiedAt: '2026-01-02T00:00:00Z',
    topics: [],
    faqs: [],
    content: '',
  },
];

describe('Blogs', () => {
  let component: Blogs;
  let fixture: ComponentFixture<Blogs>;
  let httpTesting: HttpTestingController;
  const baseUrl = `${BASE_URL}/api/blogs`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Blogs],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Blogs);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpTesting.expectOne(baseUrl).flush(mockBlogs);
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should fetch blogs on init', () => {
      fixture.detectChanges();

      const req = httpTesting.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlogs);

      expect(component.blogs()).toEqual(mockBlogs);
      expect(component.loading()).toBe(false);
    });

    it('should show spinner while loading', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-progressspinner')).toBeTruthy();
      httpTesting.expectOne(baseUrl).flush([]);
    });

    it('should show blog grid after loading', () => {
      fixture.detectChanges();
      httpTesting.expectOne(baseUrl).flush(mockBlogs);
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('app-blog-grid')).toBeTruthy();
      expect(el.querySelector('p-progressspinner')).toBeFalsy();
    });
  });

  describe('onQueryChange', () => {
    it('should refetch blogs with query param', () => {
      fixture.detectChanges();
      httpTesting.expectOne(baseUrl).flush([]);

      component.onQueryChange('angular');
      const req = httpTesting.expectOne(`${baseUrl}?query=angular`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlogs);

      expect(component.blogs()).toEqual(mockBlogs);
    });
  });

  describe('onStatusChange', () => {
    it('should refetch blogs with status param', () => {
      fixture.detectChanges();
      httpTesting.expectOne(baseUrl).flush([]);

      component.onStatusChange('PUBLISHED');
      const req = httpTesting.expectOne(`${baseUrl}?status=PUBLISHED`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlogs);

      expect(component.blogs()).toEqual(mockBlogs);
    });
  });

  describe('template rendering', () => {
    it('should render the title', () => {
      fixture.detectChanges();
      httpTesting.expectOne(baseUrl).flush([]);
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blogs__title')?.textContent?.trim()).toBe('Blogs');
    });

    it('should render the filter component', () => {
      fixture.detectChanges();
      httpTesting.expectOne(baseUrl).flush([]);
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('app-blogs-filter')).toBeTruthy();
    });
  });
});
