import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryService } from '../../services/blog-category-service';
import { BlogCategoryStep } from './blog-category-step';

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

describe('BlogCategoryStep', () => {
  let component: BlogCategoryStep;
  let fixture: ComponentFixture<BlogCategoryStep>;
  let listCategories: ReturnType<typeof vi.fn<() => Observable<BlogCategory[]>>>;

  beforeEach(async () => {
    listCategories = vi.fn(() => of(categories));

    await TestBed.configureTestingModule({
      imports: [BlogCategoryStep],
      providers: [{ provide: BlogCategoryService, useValue: { listCategories } }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCategoryStep);
    component = fixture.componentInstance;
  });

  it('should load the complete category list', () => {
    fixture.detectChanges();

    expect(listCategories).toHaveBeenCalledOnce();
    expect(component.categories()).toEqual(categories);
    expect(component.loading()).toBe(false);
    expect(component.loadFailed()).toBe(false);
  });

  it('should initialize the selected slug for editing', () => {
    fixture.componentRef.setInput('initialCategorySlug', 'technology');
    fixture.detectChanges();

    expect(component.getValue()).toBe('technology');
  });

  it('should return the selected category slug', () => {
    fixture.detectChanges();
    component.categorySlugControl.setValue('culture');

    expect(component.getValue()).toBe('culture');
  });

  it('should allow leaving a blog uncategorized', () => {
    fixture.detectChanges();

    expect(component.getValue()).toBeUndefined();
  });

  it('should report a category-list loading failure', () => {
    listCategories.mockReturnValue(throwError(() => new Error('Request failed')));
    fixture = TestBed.createComponent(BlogCategoryStep);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.loadFailed()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Categories could not be loaded');
  });

  it('should unsubscribe from category loading when destroyed', () => {
    const unsubscribe = vi.fn();
    listCategories.mockReturnValue(
      new Observable<BlogCategory[]>((): (() => void) => () => {
        unsubscribe();
      }),
    );
    fixture.detectChanges();

    fixture.destroy();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it('should reserve vertical space for the category selection', () => {
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('.category-step') as HTMLElement;
    expect(getComputedStyle(section).minHeight).toBe('12rem');
  });
});
