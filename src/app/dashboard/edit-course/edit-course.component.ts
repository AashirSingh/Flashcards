import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfigService } from '../../config.service';  
import { Course } from '../../shared/models/course.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import FormBuilder and FormGroup

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
})
export class EditCourseComponent implements OnInit {
  courses: Course[] = [];
  editCourseForm: FormGroup;  // Form group to manage the form inputs

  constructor(
    private modalController: ModalController,
    private configService: ConfigService,
    private formBuilder: FormBuilder  // Inject FormBuilder
  ) {
    // Initialize the form with validators
    this.editCourseForm = this.formBuilder.group({
      selectedCourseId: ['', Validators.required],
      newQuestion: ['', Validators.required],
      newAnswer: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.configService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  addQuestionAndAnswer() {
    if (this.editCourseForm.valid) {
      const courseId = parseInt(this.editCourseForm.value.selectedCourseId, 10);  // Convert to number
      const { newQuestion, newAnswer } = this.editCourseForm.value;

      this.configService.addQuestionToCourse(courseId, newQuestion, newAnswer)
        .then(() => {
          console.log('Question and answer added successfully.');
          this.dismiss();
        })
        .catch(err => {
          console.error('Error adding question and answer:', err);
        });
    } else {
      console.error('All fields are required.');
    }
  }
}