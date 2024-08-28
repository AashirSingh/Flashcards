import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent {
  selectedCourseId: string = '';  // Initialize with an empty string
  newQuestion: string = '';       // Initialize with an empty string
  newAnswer: string = '';         // Initialize with an empty string
  courses: any[] = [];            // Initialize as an empty array

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  addQuestionAndAnswer() {
    console.log('Adding:', this.newQuestion, this.newAnswer, 'to course', this.selectedCourseId);
    this.dismiss();
  }
}