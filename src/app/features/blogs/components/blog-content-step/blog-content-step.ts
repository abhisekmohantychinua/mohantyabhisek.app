import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  type OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { ContentViewer } from '../content-viewer/content-viewer';

@Component({
  selector: 'app-blog-content-step',
  imports: [FormsModule, MonacoEditorModule, ContentViewer],
  templateUrl: './blog-content-step.html',
  styleUrl: './blog-content-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContentStep implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly initialContent = input<string>();

  protected readonly content = signal('');
  protected readonly isDark = signal(false);

  protected readonly editorOptions = computed(() => ({
    theme: this.isDark() ? 'vs-dark' : 'vs',
    language: 'html',
    minimap: { enabled: false },
    wordWrap: 'on' as const,
    automaticLayout: true,
  }));

  readonly isValid = computed(() => this.content().trim().length >= 1);

  constructor() {
    effect(() => {
      const initial = this.initialContent();
      if (initial) {
        this.content.set(initial);
      }
    });
  }

  ngOnInit(): void {
    this.detectDarkMode();
    this.observeDarkMode();
  }

  getValue(): string {
    return this.content();
  }

  private detectDarkMode(): void {
    this.isDark.set(this.document.documentElement.classList.contains('app-dark'));
  }

  private observeDarkMode(): void {
    const observer = new MutationObserver(() => {
      this.detectDarkMode();
    });

    observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
