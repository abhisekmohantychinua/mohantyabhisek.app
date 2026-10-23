import { type ComponentFixture, TestBed } from '@angular/core/testing';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryGrid } from './blog-category-grid';

const categories: BlogCategory[] = [
  {
    slug: 'technology',
    title: 'Technology',
    description: 'Technology articles',
    createdAt: '2026-01-01T00:00:00Z',
    lastModifiedAt: '2026-01-02T00:00:00Z',
  },
  {
    slug: 'culture',
    title: 'Culture',
    description: 'Culture articles',
    createdAt: '2026-02-01T00:00:00Z',
    lastModifiedAt: '2026-02-02T00:00:00Z',
  },
];

describe('BlogCategoryGrid', () => {
  let component: BlogCategoryGrid;
  let fixture: ComponentFixture<BlogCategoryGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCategoryGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each category', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-blog-category-card').length).toBe(2);
  });

  it('should show an empty state when there are no categories', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.blog-category-grid__empty')?.textContent?.trim()).toBe(
      'No blog categories found.',
    );
  });
});
