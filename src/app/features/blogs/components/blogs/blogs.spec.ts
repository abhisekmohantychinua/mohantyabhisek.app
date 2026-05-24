import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { MessageService } from 'primeng/api';

import { BASE_URL } from '../../../../configs/app-config';
import type PageResponse from '../../../../models/page-response';
import type { Blog } from '../../models/blog';
import { Blogs } from './blogs';

describe('Blogs', () => {
  let component: Blogs;
  let fixture: ComponentFixture<Blogs>;
  let httpTesting: HttpTestingController;

  const baseUrl = `${BASE_URL}/api/blogs`;

  const mockPageResponse: PageResponse<Blog> = {
    items: [
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
    ],
    currentIndex: 0,
    isLastIndex: false,
  };

  beforeEach(async () => {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;

      readonly rootMargin = '';

      readonly scrollMargin = '';

      readonly thresholds: readonly number[] = [];

      disconnect(): void {
        return;
      }

      observe(): void {
        return;
      }

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }

      unobserve(): void {
        return;
      }
    }

    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [Blogs],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} },
      ],
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

    httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should fetch blogs on init', () => {
      fixture.detectChanges();

      const req = httpTesting.expectOne(`${baseUrl}?index=0`);

      expect(req.request.method).toBe('GET');

      req.flush(mockPageResponse);

      expect(component.blogs()).toEqual(mockPageResponse.items);
      expect(component.initialLoading()).toBe(false);
      expect(component.currentIndex()).toBe(0);
      expect(component.isLastIndex()).toBe(false);
    });

    it('should show spinner while initial loading', () => {
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('p-progressspinner')).toBeTruthy();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);
    });

    it('should show blog grid after loading', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('app-blog-grid')).toBeTruthy();
    });

    it('should hide initial loading spinner after fetch completes', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(component.initialLoading()).toBe(false);

      expect(el.querySelector('.blogs__spinner')).toBeFalsy();
    });
  });

  describe('onQueryChange', () => {
    it('should reset pagination and refetch blogs with query param', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.onQueryChange('angular');

      const req = httpTesting.expectOne(`${baseUrl}?query=angular&index=0`);

      expect(req.request.method).toBe('GET');

      req.flush(mockPageResponse);

      expect(component.currentIndex()).toBe(0);
      expect(component.blogs()).toEqual(mockPageResponse.items);
    });
  });

  describe('onStatusChange', () => {
    it('should reset pagination and refetch blogs with status param', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.onStatusChange('PUBLISHED');

      const req = httpTesting.expectOne(`${baseUrl}?status=PUBLISHED&index=0`);

      expect(req.request.method).toBe('GET');

      req.flush(mockPageResponse);

      expect(component.currentIndex()).toBe(0);
      expect(component.blogs()).toEqual(mockPageResponse.items);
    });
  });

  describe('pagination', () => {
    it('should load next page and append blogs', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      const nextPageResponse: PageResponse<Blog> = {
        items: [
          {
            slug: 'blog-two',
            title: 'Blog Two',
            description: 'Description two',
            status: 'PUBLISHED',
            postedAt: '2026-02-01T00:00:00Z',
            lastModifiedAt: '2026-02-02T00:00:00Z',
            topics: [],
            faqs: [],
            content: '',
          },
        ],
        currentIndex: 1,
        isLastIndex: true,
      };

      component.loadNextPage();

      const req = httpTesting.expectOne(`${baseUrl}?index=1`);

      expect(req.request.method).toBe('GET');

      req.flush(nextPageResponse);

      expect(component.currentIndex()).toBe(1);

      expect(component.blogs()).toEqual([...mockPageResponse.items, ...nextPageResponse.items]);

      expect(component.isLastIndex()).toBe(true);
    });

    it('should not load next page when already loading more', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.loadingMore.set(true);

      component.loadNextPage();

      httpTesting.expectNone(`${baseUrl}?index=1`);
    });

    it('should not load next page when last index is reached', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush({
        ...mockPageResponse,
        isLastIndex: true,
      });

      component.loadNextPage();

      httpTesting.expectNone(`${baseUrl}?index=1`);
    });

    it('should not skip page indexes during rapid loadNextPage calls', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.loadNextPage();
      component.loadNextPage();
      component.loadNextPage();

      const req = httpTesting.expectOne(`${baseUrl}?index=1`);

      expect(req.request.method).toBe('GET');

      req.flush({
        ...mockPageResponse,
        currentIndex: 1,
        isLastIndex: false,
      });

      expect(component.currentIndex()).toBe(1);

      httpTesting.expectNone(`${baseUrl}?index=2`);
      httpTesting.expectNone(`${baseUrl}?index=3`);
    });
    it('should update current index from response instead of local increment', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.loadNextPage();

      httpTesting.expectOne(`${baseUrl}?index=1`).flush({
        ...mockPageResponse,
        currentIndex: 1,
        isLastIndex: false,
      });

      expect(component.currentIndex()).toBe(1);
    });
  });

  describe('template rendering', () => {
    it('should render the title', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('.blogs__title')?.textContent?.trim()).toBe('Blogs');
    });

    it('should render the filter component', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('app-blogs-filter')).toBeTruthy();
    });

    it('should render scroll anchor', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('.blogs__scroll-anchor')).toBeTruthy();
    });

    it('should show loading more spinner while loading next page', () => {
      fixture.detectChanges();

      httpTesting.expectOne(`${baseUrl}?index=0`).flush(mockPageResponse);

      component.loadingMore.set(true);

      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;

      expect(el.querySelector('.blogs__loading-more')).toBeTruthy();
    });
  });
});
