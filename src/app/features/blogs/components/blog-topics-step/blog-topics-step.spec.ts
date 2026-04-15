import { type ComponentFixture,TestBed } from '@angular/core/testing';

import { BlogTopicsStep } from './blog-topics-step';

describe('BlogTopicsStep', () => {
  let component: BlogTopicsStep;
  let fixture: ComponentFixture<BlogTopicsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTopicsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogTopicsStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have isValid as false initially (no topics)', () => {
      expect(component.isValid()).toBe(false);
    });

    it('should have an empty topics list', () => {
      expect(component.getValue()).toEqual([]);
    });
  });

  describe('initialTopics input', () => {
    it('should pre-populate topics from input', async () => {
      fixture.componentRef.setInput('initialTopics', ['angular', 'typescript']);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.getValue()).toEqual(['angular', 'typescript']);
      expect(component.isValid()).toBe(true);
    });
  });

  describe('addTopic', () => {
    it('should add a trimmed topic and reset the control', () => {
      component['topicControl'].setValue('  Angular  ');
      component['addTopic']();

      expect(component.getValue()).toEqual(['Angular']);
      expect(component['topicControl'].value).toBe('');
    });

    it('should ignore empty values', () => {
      component['topicControl'].setValue('');
      component['addTopic']();

      expect(component.getValue()).toEqual([]);
    });

    it('should ignore whitespace-only values', () => {
      component['topicControl'].setValue('   ');
      component['addTopic']();

      expect(component.getValue()).toEqual([]);
    });

    it('should detect duplicates (case-insensitive) and set duplicate signal', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();

      component['topicControl'].setValue('angular');
      component['addTopic']();

      expect(component.getValue()).toEqual(['Angular']);
      expect(component['duplicate']()).toBe(true);
    });

    it('should clear duplicate flag on successful add', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();

      component['topicControl'].setValue('angular');
      component['addTopic']();
      expect(component['duplicate']()).toBe(true);

      component['topicControl'].setValue('TypeScript');
      component['addTopic']();
      expect(component['duplicate']()).toBe(false);
    });
  });

  describe('removeTopic', () => {
    it('should remove topic at the given index', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();
      component['topicControl'].setValue('TypeScript');
      component['addTopic']();

      component['removeTopic'](0);

      expect(component.getValue()).toEqual(['TypeScript']);
    });
  });

  describe('onKeydown', () => {
    it('should call addTopic when Enter is pressed', () => {
      component['topicControl'].setValue('Angular');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventSpy = vi.spyOn(event, 'preventDefault');

      component['onKeydown'](event);

      expect(preventSpy).toHaveBeenCalled();
      expect(component.getValue()).toEqual(['Angular']);
    });

    it('should not add topic for non-Enter keys', () => {
      component['topicControl'].setValue('Angular');
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component['onKeydown'](event);

      expect(component.getValue()).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('should be true after adding a topic', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();

      expect(component.isValid()).toBe(true);
    });

    it('should become false after removing the last topic', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();
      component['removeTopic'](0);

      expect(component.isValid()).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the current topics array', () => {
      component['topicControl'].setValue('Angular');
      component['addTopic']();
      component['topicControl'].setValue('RxJS');
      component['addTopic']();

      expect(component.getValue()).toEqual(['Angular', 'RxJS']);
    });
  });
});
