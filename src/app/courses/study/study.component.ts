// study.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Course } from '../../shared/models/course.model'; // Ensure you have this import
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
    super(); // Call the base class constructor
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      console.log("Configuration fetched:", config); // Log the fetched configuration
      const course = config.courses.find((c: Course) => c.id === this.courseId);
      if (course && course.data) {
        this.studyMaterials = course.data as Set[];
        console.log("Study materials loaded for course ID:", this.courseId); // Log the successful data load
      } else {
        console.error("No data found for course:", this.courseId); // Log when no data is found
      }
    });
  }
}