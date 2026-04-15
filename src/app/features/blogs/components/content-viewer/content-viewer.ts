import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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

  readonly content = input.required<string>();

  protected readonly sanitizedContent = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.content()),
  );
}
