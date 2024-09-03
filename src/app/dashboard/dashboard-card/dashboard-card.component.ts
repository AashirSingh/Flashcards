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
  @Input() courseId!: number;  // Change this to number

  constructor(private router: Router) {}

  goToFlashcard(mode: string, courseId: number) {  // Ensure courseId is treated as a number
    this.router.navigate([`/flashcard/${mode}/${courseId}`]);
  }
}