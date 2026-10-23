import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { BlogCategory } from '../../models/blog-category';
import { BlogCategoryCard } from '../blog-category-card/blog-category-card';

@Component({
  selector: 'app-blog-category-grid',
  imports: [BlogCategoryCard],
  templateUrl: './blog-category-grid.html',
  styleUrl: './blog-category-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryGrid {
  readonly categories = input.required<BlogCategory[]>();
  readonly editRequested = output<BlogCategory>();
}
