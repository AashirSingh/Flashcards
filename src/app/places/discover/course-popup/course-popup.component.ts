import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-popup',
  templateUrl: './course-popup.component.html',
  styleUrls: ['./course-popup.component.scss'],
})
export class CoursePopupComponent {
  @Input() courseId!: number;
  @Input() courseName!: string;
  @Input() courseDescription!: string;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  navigateTo(option: string) {
    // Logic to navigate to practice, study, or quiz with courseId
    const route = `/courses/${option}/${this.courseId}`;
    this.router.navigate([route]).then(() => {
      this.dismiss(); // Dismiss after navigating successfully
    });
  }
}
