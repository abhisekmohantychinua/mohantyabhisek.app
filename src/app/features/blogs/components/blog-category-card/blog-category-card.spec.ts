import { type ComponentFixture, TestBed } from '@angular/core/testing';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCategoryCard);
    component = fixture.componentInstance;
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

  it('should emit the category when the edit action is activated', () => {
    const editSpy = vi.spyOn(component.editRequested, 'emit');

    component.editRequested.emit(mockCategory);

    expect(editSpy).toHaveBeenCalledWith(mockCategory);
  });
});
