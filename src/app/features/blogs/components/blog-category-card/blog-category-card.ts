import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  readonly category = input.required<BlogCategory>();
  readonly editRequested = output<BlogCategory>();
}
