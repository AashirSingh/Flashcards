import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfigService } from '../../config.service';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent {

  createCourseForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private configService: ConfigService,
    private formBuilder: FormBuilder
  ) {
    this.createCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      newQuestion: ['', Validators.required],
      newAnswer: ['', Validators.required],
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  createCourse() {
    if (this.createCourseForm.valid) {
      const { courseName, newQuestion, newAnswer } = this.createCourseForm.value;

      this.configService.createNewCourse(courseName, newQuestion, newAnswer)
        .then(() => {
          console.log('Course created successfully.');
          this.dismiss();
        })
        .catch(err => {
          console.error('Error creating course:', err);
        });
    } else {
      console.error('All fields are required.');
    }
  }
}
