import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Course } from '../shared/models/course.model';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { CreateCourseComponent } from './create-course/create-course.component';
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

  async openCreateCourseModal() {
    const modal = await this.modalController.create({
      component: CreateCourseComponent,
    });
  
    modal.onDidDismiss().then(() => {
      this.loadCourses();  // Refresh the course list
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

  loadCourses() {
    this.configService.getCourses().subscribe(courses => {
      if (courses.length > 0) {
        this.courses = courses;
      } else {
        console.error('No courses found.');
      }
    });
  }

  // Navigation to flashcard
  goToFlashcard(mode: string, courseId: string) {
    this.router.navigate(['/flashcard', mode, courseId]);
  }

  // Navigation to quiz
  goToQuiz(courseId: string) {
    this.router.navigate(['/quiz', courseId]);
  }

  logout() {
    console.log('Logout button clicked');
    this.router.navigate(['/login']);
  }
}
