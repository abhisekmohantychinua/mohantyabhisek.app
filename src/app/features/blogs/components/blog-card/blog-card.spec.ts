import { Clipboard } from '@angular/cdk/clipboard';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import type { Blog } from '../../models/blog';
import { BlogCard } from './blog-card';

const mockBlog: Blog = {
  slug: 'my-first-blog',
  title: 'My First Blog Post With a Very Long Title That Should Be Truncated',
  description: 'This is the description of the blog post which provides a summary of the content.',
  status: 'PUBLISHED',
  postedAt: '2026-01-15T10:00:00Z',
  lastModifiedAt: '2026-04-10T14:30:00Z',
  topics: ['angular'],
  faqs: [],
  content: '',
};

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCard);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.componentRef.setInput('blog', mockBlog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('statusSeverity', () => {
    it('should return success for PUBLISHED status', () => {
      expect(component['statusSeverity']()).toBe('success');
    });

    it('should return warn for UNPUBLISHED status', () => {
      fixture.componentRef.setInput('blog', { ...mockBlog, status: 'UNPUBLISHED' });
      fixture.detectChanges();
      expect(component['statusSeverity']()).toBe('warn');
    });
  });

  describe('navigate', () => {
    it('should navigate to blogs/[slug]', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component['navigate']();
      expect(navSpy).toHaveBeenCalledWith(['/blogs', 'my-first-blog']);
    });
  });

  describe('copySlug', () => {
    it('should copy slug to clipboard', () => {
      const clipboard = TestBed.inject(Clipboard);
      const copySpy = vi.spyOn(clipboard, 'copy');
      const event = new Event('click');
      vi.spyOn(event, 'stopPropagation');

      component['copySlug'](event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(copySpy).toHaveBeenCalledWith('my-first-blog');
    });
  });

  describe('openExternal', () => {
    it('should open external URL in new tab', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const event = new Event('click');
      vi.spyOn(event, 'stopPropagation');

      component['openExternal'](event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith(
        'https://mohantyabhisek.com/blogs/my-first-blog',
        '_blank',
        'noopener,noreferrer',
      );
    });
  });

  describe('template rendering', () => {
    it('should display the slug', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blog-card__slug')?.textContent?.trim()).toBe('my-first-blog');
    });

    it('should display the title', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blog-card__title')?.textContent?.trim()).toContain('My First Blog');
    });

    it('should display the description', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blog-card__description')?.textContent?.trim()).toContain(
        'This is the description',
      );
    });

    it('should display the status tag', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-tag')).toBeTruthy();
    });

    it('should display date information', () => {
      const el = fixture.nativeElement as HTMLElement;
      const dates = el.querySelectorAll('.blog-card__date');
      expect(dates.length).toBe(2);
    });

    it('should have correct aria-label', () => {
      const el = fixture.nativeElement as HTMLElement;
      const card = el.querySelector('.blog-card');
      expect(card?.getAttribute('aria-label')).toContain('My First Blog');
    });

    it('should navigate on click', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      const card = fixture.nativeElement.querySelector('.blog-card') as HTMLElement;
      card.click();
      expect(navSpy).toHaveBeenCalledWith(['/blogs', 'my-first-blog']);
    });

    it('should hide postedAt when not set', () => {
      fixture.componentRef.setInput('blog', { ...mockBlog, postedAt: '' });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const dates = el.querySelectorAll('.blog-card__date');
      expect(dates.length).toBe(1);
    });
  });
});
