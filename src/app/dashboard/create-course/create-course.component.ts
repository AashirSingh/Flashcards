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
      newDescription: ['', Validators.required], // Ensure you are capturing the description
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  createCourse() {
    if (this.createCourseForm.valid) {
      const { courseName, newDescription } = this.createCourseForm.value;

      this.configService.createNewCourse(courseName, newDescription)
        .then(() => {
          console.log('Course created successfully.');
          this.dismiss(); // Close the modal upon success
        })
        .catch(err => {
          console.error('Error creating course:', err);
        });
    } else {
      console.error('All fields are required.');
    }
  }
}