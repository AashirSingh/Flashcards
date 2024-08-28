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
  courses: Course[] = []; // Specify the type as an array of Course objects

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
    this.configService.getConfig().subscribe(data => {
      if (data && data.courses) {
        this.courses = data.courses as Course[];
      } else {
        console.error('Courses data is missing in the config response.');
      }
    });
  }

  goToFlashcard(mode: string, courseId: string) {
    this.router.navigate(['/flashcard', mode, courseId]);
  }

   // Placeholder for opening create course modal
   openCreateCourseModal() {
    console.log('Open Create Course Modal');
  }
}