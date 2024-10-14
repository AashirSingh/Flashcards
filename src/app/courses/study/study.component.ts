import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent extends BaseComponent implements OnInit {
  @Input() override courseId!: string;
  studyMaterials: Set[] = [];
  private audio: HTMLAudioElement;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {
    super();
    this.audio = new Audio();
  }

  ngOnInit(): void {
    // First, check if `courseId` is provided through route parameter.
    if (!this.courseId) {
      this.route.paramMap.subscribe(params => {
        const idFromRoute = params.get('id');
        if (idFromRoute) {
          this.courseId = idFromRoute;
        }
        this.loadCourseData();
      });
    } else {
      // If courseId is passed as an @Input(), load the course data.
      this.loadCourseData();
    }
  }

  loadCourseData(): void {
    if (!this.courseId) {
      console.error("Course ID is not provided.");
      return;
    }

    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId!);
      if (course && course.components.study) {
        this.studyMaterials = course.components.study.questions as Set[];
        this.playSound('/assets/sounds/study-material.mp3');
        console.log("Study materials loaded:", this.studyMaterials);
      } else {
        console.error("No data found for course:", this.courseId);
        this.studyMaterials = [];
      }
    });
  }

  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}