import { Clipboard } from '@angular/cdk/clipboard';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryCard } from './blog-category-card';

const mockCategory: BlogCategory = {
  slug: 'technology',
  title: 'Technology',
  description: 'Articles about technology and software.',
  createdAt: '2026-01-01T00:00:00Z',
  lastModifiedAt: '2026-02-01T00:00:00Z',
};

describe('BlogCategoryCard', () => {
  let component: BlogCategoryCard;
  let fixture: ComponentFixture<BlogCategoryCard>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCategoryCard);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.componentRef.setInput('category', mockCategory);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render category identity and description', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.blog-category-card__slug')?.textContent?.trim()).toBe(
      'technology',
    );
    expect(element.querySelector('.blog-category-card__title')?.textContent?.trim()).toBe(
      'Technology',
    );
    expect(element.querySelector('.blog-category-card__description')?.textContent?.trim()).toBe(
      'Articles about technology and software.',
    );
  });

  it('should render category dates', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.blog-category-card__date').length).toBe(2);
  });

  it('should navigate to the category detail page when the card is activated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component['navigate']();

    expect(navigateSpy).toHaveBeenCalledWith(['/blogs/categories', 'technology']);
  });

  it('should copy the category slug without bubbling the click', () => {
    const clipboard = TestBed.inject(Clipboard);
    const copySpy = vi.spyOn(clipboard, 'copy');
    const event = new Event('click');
    const stopSpy = vi.spyOn(event, 'stopPropagation');

    component['copySlug'](event);

    expect(copySpy).toHaveBeenCalledWith('technology');
    expect(stopSpy).toHaveBeenCalledOnce();
  });

  it('should open the public category page in a new tab without bubbling the click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const event = new Event('click');
    const stopSpy = vi.spyOn(event, 'stopPropagation');

    component['openExternal'](event);

    expect(openSpy).toHaveBeenCalledWith(
      'https://mohantyabhisek.com/blogs/categories/technology',
      '_blank',
      'noopener,noreferrer',
    );
    expect(stopSpy).toHaveBeenCalledOnce();
  });
});
