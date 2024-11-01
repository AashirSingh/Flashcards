import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { ModalController } from '@ionic/angular';
import { OptionsModalComponent } from './options-modal/options-modal.component';  // Import the modal component

@Component({
  selector: 'app-course-topics',
  templateUrl: './course-topics.page.html',
  styleUrls: ['./course-topics.page.scss'],
})
export class CourseTopicsPage implements OnInit {
  courseId!: number;
  topics: { title: string }[] = [];  // Updated type to reflect new structure

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private modalController: ModalController,  // Inject ModalController
    private router: Router  // Inject Router
  ) {}

  ngOnInit() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    this.courseId = courseIdParam ? +courseIdParam : 0;
    this.loadTopics();
  }

  loadTopics() {
    if (this.courseId) {
      this.configService.getCourseTopics(this.courseId).subscribe(
        (topics) => {
          this.topics = topics;
        },
        (error) => {
          console.error('Error loading topics:', error);
        }
      );
    } else {
      console.error('Invalid courseId');
    }
  }

  async openOptionsModal() {
    const modal = await this.modalController.create({
      component: OptionsModalComponent
    });
    return await modal.present();
  }

  goToDashboard() {
    // Explicitly navigate to the dashboard page
    console.log("Going to dashboard")
    this.router.navigate(['places/tabs/dashboard']);
  }
}