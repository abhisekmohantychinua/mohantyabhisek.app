import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import type { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-card',
  imports: [DatePipe, ButtonModule, TagModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCard {
  private readonly router = inject(Router);
  private readonly clipboard = inject(Clipboard);

  readonly blog = input.required<Blog>();

  protected readonly statusSeverity = computed(() =>
    this.blog().status === 'PUBLISHED' ? ('success' as const) : ('warn' as const),
  );

  protected readonly externalUrl = computed(
    () => `https://mohantyabhisek.com/blogs/${this.blog().slug}`,
  );

  protected navigate(): void {
    this.router.navigate(['/blogs', this.blog().slug]);
  }

  protected copySlug(event: Event): void {
    event.stopPropagation();
    this.clipboard.copy(this.blog().slug);
  }

  protected openExternal(event: Event): void {
    event.stopPropagation();
    window.open(this.externalUrl(), '_blank', 'noopener,noreferrer');
  }
}
