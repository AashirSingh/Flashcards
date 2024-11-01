import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseTopicsPage } from './course-topics.page';

describe('CourseTopicsPage', () => {
  let component: CourseTopicsPage;
  let fixture: ComponentFixture<CourseTopicsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTopicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
