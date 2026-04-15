import {
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  type OnInit,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import type { BlogStatus } from '../../models/blog';

interface StatusOption {
  label: string;
  value: BlogStatus | undefined;
}

@Component({
  selector: 'app-blogs-filter',
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './blogs-filter.html',
  styleUrl: './blogs-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogsFilter implements OnInit, OnDestroy {
  readonly queryChange = output<string | undefined>();
  readonly statusChange = output<string | undefined>();

  readonly statusOptions: StatusOption[] = [
    { label: 'All', value: undefined },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Unpublished', value: 'UNPUBLISHED' },
  ];

  readonly filterForm = new FormGroup({
    query: new FormControl<string>(''),
    status: new FormControl<StatusOption>(this.statusOptions[0]),
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.filterForm.controls.query.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.queryChange.emit(value || undefined);
      });

    this.filterForm.controls.status.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((option) => {
        this.statusChange.emit(option?.value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
