import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Blog } from '../../models/blog';
import { BlogCard } from '../blog-card/blog-card';

@Component({
  selector: 'app-blog-grid',
  imports: [BlogCard],
  templateUrl: './blog-grid.html',
  styleUrl: './blog-grid.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogGrid {
  readonly blogs = input.required<Blog[]>();
}
