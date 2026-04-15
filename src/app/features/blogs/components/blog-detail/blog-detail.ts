import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import type { Observable } from 'rxjs';
import { forkJoin, of, switchMap } from 'rxjs';

import type { Blog } from '../../models/blog';
import type { BlogFormData } from '../../models/blog-form-data';
import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogMetadataService } from '../../services/blog-metadata-service';
import { BlogService } from '../../services/blog-service';
import { BlogFormDialog } from '../blog-form-dialog/blog-form-dialog';
import { ContentViewer } from '../content-viewer/content-viewer';

@Component({
  selector: 'app-blog-detail',
  imports: [
    DatePipe,
    AccordionModule,
    ButtonModule,
    ChipModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TagModule,
    BlogFormDialog,
    ContentViewer,
  ],
  providers: [ConfirmationService],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly metadataService = inject(BlogMetadataService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly blog = signal<Blog | undefined>(undefined);
  protected readonly metadata = signal<BlogMetadata | undefined>(undefined);
  protected readonly loading = signal(true);
  protected readonly editDialogVisible = signal(false);

  protected readonly statusSeverity = computed(() =>
    this.blog()?.status === 'PUBLISHED' ? ('success' as const) : ('warn' as const),
  );

  protected readonly isPublished = computed(() => this.blog()?.status === 'PUBLISHED');

  protected readonly externalUrl = computed(
    () => `https://mohantyabhisek.com/blogs/${this.blog()?.slug}`,
  );

  protected readonly editHandler = (data: BlogFormData): Observable<void> => {
    const slug = this.blog()!.slug;
    return this.blogService
      .updateBlog(slug, {
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
            return this.metadataService.updateBlogMetadata(slug, metaReq);
          }
          return of(undefined) as Observable<void>;
        }),
      );
  };

  ngOnInit(): void {
    this.loadData();
  }

  protected openEditDialog(): void {
    this.editDialogVisible.set(true);
  }

  protected onSaved(): void {
    this.loadData();
  }

  protected openExternal(): void {
    window.open(this.externalUrl(), '_blank', 'noopener,noreferrer');
  }

  protected confirmPublish(): void {
    const slug = this.blog()!.slug;
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this blog?',
      header: 'Publish Blog',
      icon: 'pi pi-send',
      accept: () => {
        this.blogService.publishBlog(slug).subscribe(() => this.loadData());
      },
    });
  }

  protected confirmUnpublish(): void {
    const slug = this.blog()!.slug;
    this.confirmationService.confirm({
      message: 'Are you sure you want to unpublish this blog?',
      header: 'Unpublish Blog',
      icon: 'pi pi-eye-slash',
      accept: () => {
        this.blogService.unpublishBlog(slug).subscribe(() => this.loadData());
      },
    });
  }

  protected confirmDelete(): void {
    const slug = this.blog()!.slug;
    this.confirmationService.confirm({
      message: 'This action cannot be undone. Are you sure you want to delete this blog?',
      header: 'Delete Blog',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.blogService.deleteBlog(slug).subscribe(() => this.router.navigate(['/blogs']));
      },
    });
  }

  private loadData(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.loading.set(true);

    forkJoin({
      blog: this.blogService.getBlogBySlug(slug),
      metadata: this.metadataService.getBlogMetadata(slug),
    }).subscribe({
      next: ({ blog, metadata }) => {
        this.blog.set(blog);
        this.metadata.set(metadata);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
