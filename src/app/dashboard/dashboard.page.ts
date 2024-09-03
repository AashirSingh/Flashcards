import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Course } from '../shared/models/course.model';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses: Course[] = [];

  constructor(
    private configService: ConfigService,
    private router: Router,
    private modalController: ModalController
  ) {}

  async openEditCourseModal() {
    const modal = await this.modalController.create({
      component: EditCourseComponent,
    });
    return await modal.present();
  }

  ngOnInit() {
    this.configService.getCourses().subscribe(courses => {
      if (courses.length > 0) {
        this.courses = courses;
      } else {
        console.error('No courses found.');
      }
    });
  }

  goToFlashcard(mode: string, courseId: string) {
    this.router.navigate(['/flashcard', mode, courseId]);
  }

  openCreateCourseModal() {
    console.log('Open Create Course Modal');
  }
}