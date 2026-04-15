import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type OnInit,
  signal,
} from '@angular/core';

import type { BlogMetadata } from '../../models/blog-metadata';
import { BlogMetadataService } from '../../services/blog-metadata-service';

@Component({
  selector: 'app-blog-metadata-card',
  templateUrl: './blog-metadata-card.html',
  styleUrl: './blog-metadata-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogMetadataCard implements OnInit {
  private readonly metadataService = inject(BlogMetadataService);

  readonly slug = input.required<string>();

  protected readonly metadata = signal<BlogMetadata | undefined>(undefined);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.loadMetadata();
  }

  loadMetadata(): void {
    this.loading.set(true);
    this.metadataService.getBlogMetadata(this.slug()).subscribe({
      next: (data) => {
        this.metadata.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
