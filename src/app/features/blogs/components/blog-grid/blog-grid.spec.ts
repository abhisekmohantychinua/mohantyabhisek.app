import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { Blog } from '../../models/blog';
import { BlogGrid } from './blog-grid';

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
  {
    slug: 'blog-two',
    title: 'Blog Two',
    description: 'Description two',
    status: 'UNPUBLISHED',
    postedAt: '',
    lastModifiedAt: '2026-02-01T00:00:00Z',
    topics: [],
    faqs: [],
    content: '',
  },
];

describe('BlogGrid', () => {
  let component: BlogGrid;
  let fixture: ComponentFixture<BlogGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogGrid],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('blogs', mockBlogs);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render blog cards for each blog', () => {
      const el = fixture.nativeElement as HTMLElement;
      const cards = el.querySelectorAll('app-blog-card');
      expect(cards.length).toBe(2);
    });

    it('should show empty message when blogs list is empty', () => {
      fixture.componentRef.setInput('blogs', []);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blog-grid__empty')?.textContent?.trim()).toBe('No blogs found.');
    });

    it('should have grid layout class', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.blog-grid')).toBeTruthy();
    });
  });
});
