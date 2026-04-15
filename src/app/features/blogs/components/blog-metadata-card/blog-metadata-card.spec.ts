import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { BASE_URL } from '../../../../configs/app-config';
import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogMetadataCard } from './blog-metadata-card';

describe('BlogMetadataCard', () => {
  let component: BlogMetadataCard;
  let fixture: ComponentFixture<BlogMetadataCard>;
  let httpTesting: HttpTestingController;

  const testSlug = 'test-slug';
  const metadataUrl = `${BASE_URL}/api/blogs/${testSlug}/metadata`;

  const mockMetadata: BlogMetadata = {
    slug: testSlug,
    title: 'SEO Test Title',
    description: 'SEO test description for the blog post.',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogMetadataCard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BlogMetadataCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', testSlug);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpTesting.expectOne(metadataUrl).flush(mockMetadata);
    expect(component).toBeTruthy();
  });

  it('should show loading state initially', () => {
    expect(component['loading']()).toBe(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.metadata-card--loading')).toBeTruthy();
    expect(el.textContent).toContain('Loading metadata');

    httpTesting.expectOne(metadataUrl).flush(mockMetadata);
  });

  it('should fetch metadata on init and display it', async () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne(metadataUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMetadata);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component['loading']()).toBe(false);
    expect(component['metadata']()).toEqual(mockMetadata);

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.metadata-card__heading')?.textContent).toContain('SEO Metadata');
    expect(el.textContent).toContain('SEO Test Title');
    expect(el.textContent).toContain('SEO test description for the blog post.');
  });

  it('should show empty state on error', async () => {
    fixture.detectChanges();

    httpTesting.expectOne(metadataUrl).flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component['loading']()).toBe(false);
    expect(component['metadata']()).toBeUndefined();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.metadata-card--empty')).toBeTruthy();
    expect(el.textContent).toContain('No SEO metadata available.');
  });

  it('should reload metadata when loadMetadata is called', async () => {
    fixture.detectChanges();
    httpTesting.expectOne(metadataUrl).flush(mockMetadata);
    await fixture.whenStable();

    component.loadMetadata();
    expect(component['loading']()).toBe(true);

    httpTesting.expectOne(metadataUrl).flush({
      ...mockMetadata,
      title: 'Updated Title',
    });
    await fixture.whenStable();

    expect(component['metadata']()?.title).toBe('Updated Title');
    expect(component['loading']()).toBe(false);
  });
});
