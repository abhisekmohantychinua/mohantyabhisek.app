import { Clipboard } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import type { BlogCategory } from '../../models/blog-category';

@Component({
  selector: 'app-blog-category-card',
  imports: [DatePipe, ButtonModule],
  templateUrl: './blog-category-card.html',
  styleUrl: './blog-category-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryCard {
  private readonly clipboard = inject(Clipboard);
  private readonly router = inject(Router);

  readonly category = input.required<BlogCategory>();

  protected navigate(): void {
    this.router.navigate(['/blogs/categories', this.category().slug]);
  }

  protected copySlug(event: Event): void {
    event.stopPropagation();
    this.clipboard.copy(this.category().slug);
  }

  protected openExternal(event: Event): void {
    event.stopPropagation();
    window.open(
      `https://mohantyabhisek.com/blogs/categories/${this.category().slug}`,
      '_blank',
      'noopener,noreferrer',
    );
  }
}
