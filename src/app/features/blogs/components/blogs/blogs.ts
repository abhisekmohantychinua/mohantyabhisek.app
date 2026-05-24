import type { ElementRef } from '@angular/core';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  type OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import type { Observable } from 'rxjs';
import { exhaustMap, finalize, of, Subject, switchMap, takeUntil } from 'rxjs';

import type PageResponse from '../../../../models/page-response';
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
  protected readonly blogService = inject(BlogService);
  protected readonly metadataService = inject(BlogMetadataService);

  protected readonly destroy$ = new Subject<void>();

  /**
   * Carries the exact page index to fetch.
   * Avoids mutable pagination race conditions.
   */
  protected readonly fetchTrigger$ = new Subject<number>();

  readonly blogs = signal<Blog[]>([]);
  readonly initialLoading = signal(true);
  readonly loadingMore = signal(false);
  readonly isLastIndex = signal(false);
  readonly currentIndex = signal(0);

  readonly scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');

  observer?: IntersectionObserver;

  protected readonly createDialogVisible = signal(false);

  protected query: string | undefined;
  protected status: string | undefined;

  constructor() {
    afterNextRender(() => {
      const anchor = this.scrollAnchor();

      if (!anchor) {
        return;
      }

      this.setupIntersectionObserver(anchor.nativeElement);
    });
  }

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
        exhaustMap((index) =>
          this.loadBlogs(index).pipe(
            finalize(() => {
              this.initialLoading.set(false);
              this.loadingMore.set(false);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        this.isLastIndex.set(response.isLastIndex);

        /**
         * Commit index only after successful response.
         */
        this.currentIndex.set(response.currentIndex);

        if (response.currentIndex === 0) {
          this.blogs.set(response.items);
          return;
        }

        this.blogs.update((currentBlogs) => [...currentBlogs, ...response.items]);
      });

    /**
     * Initial page load.
     */
    this.fetchTrigger$.next(0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
  }

  onQueryChange(query: string | undefined): void {
    this.query = query;

    this.resetPagination();

    this.initialLoading.set(true);

    this.fetchTrigger$.next(0);
  }

  onStatusChange(status: string | undefined): void {
    this.status = status;

    this.resetPagination();

    this.initialLoading.set(true);

    this.fetchTrigger$.next(0);
  }

  protected onBlogCreated(): void {
    this.resetPagination();

    this.initialLoading.set(true);

    this.fetchTrigger$.next(0);
  }

  loadNextPage(): void {
    if (this.initialLoading() || this.loadingMore() || this.isLastIndex()) {
      return;
    }

    this.loadingMore.set(true);

    /**
     * Emit immutable next index.
     * Do NOT mutate currentIndex here.
     */
    const nextIndex = this.currentIndex() + 1;

    this.fetchTrigger$.next(nextIndex);
  }

  protected loadBlogs(index: number): Observable<PageResponse<Blog>> {
    return this.blogService.listBlogs(this.query, this.status, index);
  }

  protected resetPagination(): void {
    this.blogs.set([]);
    this.currentIndex.set(0);
    this.isLastIndex.set(false);
  }

  protected setupIntersectionObserver(element: HTMLDivElement): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) {
        return;
      }

      this.loadNextPage();
    });

    this.observer.observe(element);
  }
}
