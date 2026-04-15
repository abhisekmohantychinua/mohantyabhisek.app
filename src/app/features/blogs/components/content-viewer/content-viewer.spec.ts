import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentViewer } from './content-viewer';

describe('ContentViewer', () => {
  let component: ContentViewer;
  let fixture: ComponentFixture<ContentViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentViewer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', '<p>Hello</p>');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sanitized HTML content', () => {
    fixture.detectChanges();
    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    expect(viewer.innerHTML).toContain('<p>Hello</p>');
  });

  it('should update when content input changes', () => {
    fixture.componentRef.setInput('content', '<h1>Title</h1>');
    fixture.detectChanges();
    const viewer = fixture.nativeElement.querySelector('.content-viewer');
    expect(viewer.innerHTML).toContain('<h1>Title</h1>');
  });
});
