import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent extends BaseComponent implements OnInit {
  studyMaterials: Set[] = [];

  constructor(private configService: ConfigService) {
    super();  // Call the base class constructor
  }

  ngOnInit(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId);  // Convert courseId to number for comparison
      if (course && course.components.study) {
        this.studyMaterials = course.components.study.questions as Set[];  // Assume study contains questions
        console.log("Study materials loaded:", this.studyMaterials);
      } else {
        console.error("No data found for course:", this.courseId);
        this.studyMaterials = [];
      }
    });
  }
}