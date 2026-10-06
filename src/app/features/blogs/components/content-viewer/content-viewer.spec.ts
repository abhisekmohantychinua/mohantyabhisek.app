import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentViewer } from './content-viewer';

describe('ContentViewer', () => {
  let component: ContentViewer;
  let fixture: ComponentFixture<ContentViewer>;
  let resizeObserverCallback: ResizeObserverCallback;
  let observe: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    observe = vi.fn<(target: Element, options?: ResizeObserverOptions) => void>();
    disconnect = vi.fn<() => void>();

    class MockResizeObserver {
      readonly observe = observe;
      readonly unobserve = vi.fn<(target: Element) => void>();
      readonly disconnect = disconnect;

      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
      }
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    await TestBed.configureTestingModule({
      imports: [ContentViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentViewer);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('content', '<p>Hello</p>');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render HTML content', () => {
    const viewer = fixture.nativeElement.querySelector('.content-viewer');

    expect(viewer.innerHTML).toContain('<p>Hello</p>');
  });

  it('should update when content input changes', async () => {
    fixture.componentRef.setInput('content', '<h1>Title</h1>');

    fixture.detectChanges();
    await fixture.whenStable();

    const viewer = fixture.nativeElement.querySelector('.content-viewer');

    expect(viewer.innerHTML).toContain('<h1>Title</h1>');
  });

  it('should observe the content viewer for size changes', () => {
    const viewer = fixture.nativeElement.querySelector('.content-viewer');

    expect(observe).toHaveBeenCalledWith(viewer);
  });

  it('should wrap an overflowing table', () => {
    fixture.componentRef.setInput(
      'content',
      `
        <table>
          <tr>
            <td>Content</td>
          </tr>
        </table>
      `,
    );

    fixture.detectChanges();

    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    const table = viewer.querySelector('table');

    Object.defineProperty(table, 'scrollWidth', {
      configurable: true,
      value: 1000,
    });

    Object.defineProperty(viewer, 'clientWidth', {
      configurable: true,
      value: 500,
    });

    resizeObserverCallback([], {} as ResizeObserver);

    const wrapper = viewer.querySelector('.table-wrapper');

    expect(wrapper).not.toBeNull();
    expect(wrapper?.contains(table)).toBe(true);
  });

  it('should not wrap a table that fits within the content viewer', () => {
    fixture.componentRef.setInput(
      'content',
      `
        <table>
          <tr>
            <td>Content</td>
          </tr>
        </table>
      `,
    );

    fixture.detectChanges();

    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    const table = viewer.querySelector('table');

    Object.defineProperty(table, 'scrollWidth', {
      configurable: true,
      value: 400,
    });

    Object.defineProperty(viewer, 'clientWidth', {
      configurable: true,
      value: 500,
    });

    resizeObserverCallback([], {} as ResizeObserver);

    expect(viewer.querySelector('.table-wrapper')).toBeNull();
    expect(table.parentElement).toBe(viewer.querySelector('.content-viewer__content-wrapper'));
  });

  it('should not wrap an already wrapped table', () => {
    fixture.componentRef.setInput(
      'content',
      `
        <div class="table-wrapper">
          <table>
            <tr>
              <td>Content</td>
            </tr>
          </table>
        </div>
      `,
    );

    fixture.detectChanges();

    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    const table = viewer.querySelector('table');

    Object.defineProperty(table, 'scrollWidth', {
      configurable: true,
      value: 1000,
    });

    Object.defineProperty(viewer, 'clientWidth', {
      configurable: true,
      value: 500,
    });

    resizeObserverCallback([], {} as ResizeObserver);

    expect(viewer.querySelectorAll('.table-wrapper')).toHaveLength(1);
    expect(table.parentElement?.classList.contains('table-wrapper')).toBe(true);
  });

  it('should re-evaluate tables when content changes', async () => {
    fixture.componentRef.setInput(
      'content',
      `
        <table>
          <tr>
            <td>Initial</td>
          </tr>
        </table>
      `,
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    let table = viewer.querySelector('table');

    Object.defineProperty(table, 'scrollWidth', {
      configurable: true,
      value: 400,
    });

    Object.defineProperty(viewer, 'clientWidth', {
      configurable: true,
      value: 500,
    });

    resizeObserverCallback([], {} as ResizeObserver);

    expect(viewer.querySelector('.table-wrapper')).toBeNull();

    fixture.componentRef.setInput(
      'content',
      `
        <table>
          <tr>
            <td>Updated</td>
          </tr>
        </table>
      `,
    );

    fixture.detectChanges();
    await fixture.whenStable();

    table = viewer.querySelector('table');

    Object.defineProperty(table, 'scrollWidth', {
      configurable: true,
      value: 1000,
    });

    resizeObserverCallback([], {} as ResizeObserver);

    expect(viewer.querySelector('.table-wrapper')).not.toBeNull();
  });

  it('should disconnect the resize observer when destroyed', () => {
    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
  });
});
