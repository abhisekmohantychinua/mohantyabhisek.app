import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-blog-topics-step',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, ChipModule],
  templateUrl: './blog-topics-step.html',
  styleUrl: './blog-topics-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogTopicsStep {
  readonly initialTopics = input<string[]>();

  protected readonly topics = signal<string[]>([]);
  protected readonly topicControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly duplicate = signal(false);

  readonly isValid = computed(() => this.topics().length >= 1);

  constructor() {
    effect(() => {
      const initial = this.initialTopics();
      if (initial?.length) {
        this.topics.set([...initial]);
      }
    });
  }

  protected addTopic(): void {
    const value = this.topicControl.value.trim();
    if (!value) return;

    if (this.topics().some((t) => t.toLowerCase() === value.toLowerCase())) {
      this.duplicate.set(true);
      return;
    }

    this.duplicate.set(false);
    this.topics.update((topics) => [...topics, value]);
    this.topicControl.reset();
  }

  protected removeTopic(index: number): void {
    this.topics.update((topics) => topics.filter((_, i) => i !== index));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTopic();
    }
  }

  getValue(): string[] {
    return this.topics();
  }
}
