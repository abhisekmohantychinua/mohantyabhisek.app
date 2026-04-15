import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subject, switchMap, takeUntil } from 'rxjs';

import type { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog-service';
import { BlogGrid } from '../blog-grid/blog-grid';
import { BlogsFilter } from '../blogs-filter/blogs-filter';

@Component({
  selector: 'app-blogs',
  imports: [ProgressSpinnerModule, BlogsFilter, BlogGrid],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blogs implements OnInit, OnDestroy {
  private readonly blogService = inject(BlogService);
  private readonly destroy$ = new Subject<void>();
  private readonly fetchTrigger$ = new Subject<void>();

  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(true);

  protected query: string | undefined;
  protected status: string | undefined;

  ngOnInit(): void {
    this.fetchTrigger$
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return this.blogService.getAllBlogs(this.query, this.status);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((blogs) => {
        this.blogs.set(blogs);
        this.loading.set(false);
      });

    this.fetchTrigger$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQueryChange(query: string | undefined): void {
    this.query = query;
    this.fetchTrigger$.next();
  }

  onStatusChange(status: string | undefined): void {
    this.status = status;
    this.fetchTrigger$.next();
  }
}
