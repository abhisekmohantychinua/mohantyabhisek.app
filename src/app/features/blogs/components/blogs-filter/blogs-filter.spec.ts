import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsFilter } from './blogs-filter';

describe('BlogsFilter', () => {
  let component: BlogsFilter;
  let fixture: ComponentFixture<BlogsFilter>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [BlogsFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('queryChange', () => {
    it('should emit after debounce', () => {
      const emitted: (string | undefined)[] = [];
      component.queryChange.subscribe((v) => emitted.push(v));

      component.filterForm.controls.query.setValue('angular');
      vi.advanceTimersByTime(400);

      expect(emitted).toEqual(['angular']);
    });

    it('should emit undefined for empty string', () => {
      const emitted: (string | undefined)[] = [];
      component.queryChange.subscribe((v) => emitted.push(v));

      component.filterForm.controls.query.setValue('');
      vi.advanceTimersByTime(400);

      expect(emitted).toEqual([undefined]);
    });

    it('should debounce rapid changes', () => {
      const emitted: (string | undefined)[] = [];
      component.queryChange.subscribe((v) => emitted.push(v));

      component.filterForm.controls.query.setValue('a');
      vi.advanceTimersByTime(100);
      component.filterForm.controls.query.setValue('an');
      vi.advanceTimersByTime(100);
      component.filterForm.controls.query.setValue('ang');
      vi.advanceTimersByTime(400);

      expect(emitted).toEqual(['ang']);
    });
  });

  describe('statusChange', () => {
    it('should emit status value on change', () => {
      const emitted: (string | undefined)[] = [];
      component.statusChange.subscribe((v) => emitted.push(v));

      component.filterForm.controls.status.setValue(component.statusOptions[1]);

      expect(emitted).toEqual(['PUBLISHED']);
    });

    it('should emit undefined for All option', () => {
      const emitted: (string | undefined)[] = [];
      component.statusChange.subscribe((v) => emitted.push(v));

      component.filterForm.controls.status.setValue(component.statusOptions[0]);

      expect(emitted).toEqual([undefined]);
    });
  });

  describe('template rendering', () => {
    it('should render search input', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('input[formcontrolname="query"]')).toBeTruthy();
    });

    it('should render status select', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('p-select')).toBeTruthy();
    });
  });
});
