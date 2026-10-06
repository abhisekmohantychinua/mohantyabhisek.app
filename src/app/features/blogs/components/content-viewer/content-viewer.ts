import type { ElementRef } from '@angular/core';
import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.html',
  styleUrl: './content-viewer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContentViewer {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  private readonly viewer = viewChild.required<ElementRef<HTMLElement>>('contentViewer');

  readonly content = input.required<string>();

  protected readonly sanitizedContent = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.content()),
  );

  private readonly resizeObserver = new ResizeObserver(() => {
    this.wrapOverflowingTables();
  });

  private initialized = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.resizeObserver.disconnect();
    });

    afterEveryRender(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    const element = this.viewer().nativeElement;

    if (!this.initialized) {
      this.resizeObserver.observe(element);
      this.initialized = true;
    }

    this.wrapOverflowingTables();
  }

  private wrapOverflowingTables(): void {
    const element = this.viewer().nativeElement;

    element.querySelectorAll<HTMLTableElement>('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-wrapper')) {
        return;
      }

      if (table.scrollWidth > element.clientWidth) {
        const wrapper = document.createElement('div');

        wrapper.className = 'table-wrapper';

        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }
}
