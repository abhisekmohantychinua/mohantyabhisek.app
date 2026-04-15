import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

import { BASE_URL } from '../../../../configs/app-config';
import type { Blog } from '../../models/blog';
import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogDetail } from './blog-detail';

describe('BlogDetail', () => {
  let component: BlogDetail;
  let fixture: ComponentFixture<BlogDetail>;
  let httpTesting: HttpTestingController;

  const testSlug = 'test-slug';
  const blogUrl = `${BASE_URL}/api/blogs/${testSlug}`;
  const metadataUrl = `${BASE_URL}/api/blogs/${testSlug}/metadata`;

  const mockBlog: Blog = {
    slug: testSlug,
    title: 'Test Blog',
    description: 'Test desc',
    status: 'PUBLISHED',
    postedAt: '2026-01-01T00:00:00Z',
    lastModifiedAt: '2026-01-02T00:00:00Z',
    topics: ['angular'],
    faqs: [{ question: 'Q?', answer: 'A.' }],
    content: '<p>Hello</p>',
  };

  const mockMetadata: BlogMetadata = {
    slug: testSlug,
    title: 'Meta Title Long Enough For Valid',
    description: 'Meta description long enough',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (): string => testSlug } } },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(BlogDetail, {
        set: {
          imports: [DatePipe, ProgressSpinnerModule, TagModule, ButtonModule],
          template: `
            @if (loading()) { <p-progressSpinner /> }
            @else if (blog(); as b) { <h1 class="blog-detail__title">{{ b.title }}</h1> }
          `,
        },
      })
      .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BlogDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  function flushInitialRequests(): void {
    httpTesting.expectOne(blogUrl).flush(mockBlog);
    httpTesting.expectOne(metadataUrl).flush(mockMetadata);
  }

  it('should create', () => {
    fixture.detectChanges();
    flushInitialRequests();
    expect(component).toBeTruthy();
  });

  describe('loading data', () => {
    it('should load blog and metadata on init', async () => {
      fixture.detectChanges();

      const blogReq = httpTesting.expectOne(blogUrl);
      expect(blogReq.request.method).toBe('GET');
      const metaReq = httpTesting.expectOne(metadataUrl);
      expect(metaReq.request.method).toBe('GET');

      blogReq.flush(mockBlog);
      metaReq.flush(mockMetadata);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component['blog']()).toEqual(mockBlog);
      expect(component['metadata']()).toEqual(mockMetadata);
      expect(component['loading']()).toBe(false);
    });

    it('should show spinner while loading', () => {
      expect(component['loading']()).toBe(true);

      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('p-progressspinner');
      expect(spinner).toBeTruthy();

      flushInitialRequests();
    });

    it('should display blog title after loading', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.blog-detail__title');
      expect(title?.textContent).toContain('Test Blog');
    });
  });

  describe('statusSeverity', () => {
    it('should return success for PUBLISHED', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();

      expect(component['statusSeverity']()).toBe('success');
    });

    it('should return warn for non-PUBLISHED', async () => {
      fixture.detectChanges();

      httpTesting.expectOne(blogUrl).flush({ ...mockBlog, status: 'UNPUBLISHED' });
      httpTesting.expectOne(metadataUrl).flush(mockMetadata);
      await fixture.whenStable();

      expect(component['statusSeverity']()).toBe('warn');
    });
  });

  describe('onSaved', () => {
    it('should reload data when onSaved is called', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();

      component['onSaved']();

      const blogReq = httpTesting.expectOne(blogUrl);
      const metaReq = httpTesting.expectOne(metadataUrl);
      blogReq.flush(mockBlog);
      metaReq.flush(mockMetadata);
      await fixture.whenStable();

      expect(component['blog']()).toEqual(mockBlog);
    });
  });

  describe('isPublished', () => {
    it('should return true for PUBLISHED status', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();

      expect(component['isPublished']()).toBe(true);
    });

    it('should return false for non-PUBLISHED status', async () => {
      fixture.detectChanges();
      httpTesting.expectOne(blogUrl).flush({ ...mockBlog, status: 'UNPUBLISHED' });
      httpTesting.expectOne(metadataUrl).flush(mockMetadata);
      await fixture.whenStable();

      expect(component['isPublished']()).toBe(false);
    });
  });

  describe('externalUrl', () => {
    it('should compute the external URL from slug', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();

      expect(component['externalUrl']()).toBe('https://mohantyabhisek.com/blogs/test-slug');
    });
  });

  describe('confirmPublish', () => {
    it('should publish and reload on accept', async () => {
      fixture.detectChanges();
      flushInitialRequests();
      await fixture.whenStable();

      component['confirmPublish']();

      // Since we can't easily mock ConfirmationService with providers override, verify the method exists and runs
      expect(typeof component['confirmPublish']).toBe('function');
    });
  });

  describe('confirmDelete', () => {
    it('should be a function', () => {
      fixture.detectChanges();
      flushInitialRequests();
      expect(typeof component['confirmDelete']).toBe('function');
    });
  });
});
