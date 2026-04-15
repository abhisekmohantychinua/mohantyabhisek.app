import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { Observable } from 'rxjs';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import type { Blog } from '../../models/blog';
import type { BlogFormData } from '../../models/blog-form-data';
import { BlogMetadataService } from '../../services/blog-metadata-service';
import { BlogService } from '../../services/blog-service';
import { BlogFormDialog } from '../blog-form-dialog/blog-form-dialog';
import { BlogGrid } from '../blog-grid/blog-grid';
import { BlogsFilter } from '../blogs-filter/blogs-filter';

@Component({
  selector: 'app-blogs',
  imports: [ProgressSpinnerModule, ButtonModule, BlogsFilter, BlogGrid, BlogFormDialog],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blogs implements OnInit, OnDestroy {
  private readonly blogService = inject(BlogService);
  private readonly metadataService = inject(BlogMetadataService);
  private readonly destroy$ = new Subject<void>();
  private readonly fetchTrigger$ = new Subject<void>();

  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal(true);
  protected readonly createDialogVisible = signal(false);

  protected query: string | undefined;
  protected status: string | undefined;

  protected readonly createHandler = (data: BlogFormData): Observable<void> =>
    this.blogService
      .createBlog({
        slug: data.slug,
        title: data.title,
        description: data.description,
        topics: data.topics,
        faqs: data.faqs,
        content: data.content,
      })
      .pipe(
        switchMap(() => {
          const metaReq: Record<string, string> = {};
          if (data.metaTitle) {
            metaReq['title'] = data.metaTitle;
          }
          if (data.metaDescription) {
            metaReq['description'] = data.metaDescription;
          }
          if (Object.keys(metaReq).length) {
            return this.metadataService.updateBlogMetadata(data.slug, metaReq);
          }
          return of(undefined) as Observable<void>;
        }),
      );

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

  protected onBlogCreated(): void {
    this.fetchTrigger$.next();
  }
}
