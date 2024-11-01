import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() courseId!: number;

  constructor(private router: Router) {}

  // Navigate to CourseTopicsPage when the card is clicked
  goToCourseTopics(courseId: number) {
    this.router.navigate([`/course-topics/${courseId}`]);
  }
}
