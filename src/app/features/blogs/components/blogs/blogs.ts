import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blogs',
  imports: [],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blogs {}
