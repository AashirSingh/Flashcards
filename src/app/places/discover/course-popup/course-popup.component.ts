// course-popup.component.ts
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-popup',
  templateUrl: './course-popup.component.html',
  styleUrls: ['./course-popup.component.scss'],
})
export class CoursePopupComponent {
  @Input() courseName!: string;
  @Input() courseDescription!: string;
  @Input() courseId!: number;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async navigateTo(option: string) {
    // Ensure modal is dismissed before navigating
    await this.modalCtrl.dismiss();
    this.router.navigate([`/courses/${option}`, this.courseId]);
  }
}
