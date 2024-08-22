import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service'; // Ensure this import path is correct

interface Course {
  id: string;
  name: string;
  description: string;
  components: {
    practice: any;
    study: any;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses: Course[] = []; // Specify the type as an array of Course objects

  constructor(
    private configService: ConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(data => {
      if (data && data.courses) {
        this.courses = data.courses as Course[]; // Cast the response to an array of Course objects
      } else {
        console.error('Courses data is missing in the config response.');
      }
    });
  }

  goToFlashcard(mode: string, courseId: string) {
    // Use router to navigate
    this.router.navigate(['/flashcard', mode, courseId]);
  }
}