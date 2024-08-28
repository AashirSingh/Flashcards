import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Course } from '../../shared/models/course.model'; // Ensure you have this import
import { Set } from '../../shared/models/set.model';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId!: string;
  questions: Set[] = [];  // Assuming Set has a 'question' and 'answer' field
  currentQuestionIndex = 0;
  showAnswer = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      const course = config.courses.find((c: Course) => c.id === this.courseId);
      if (course && course.data) {
        this.questions = course.data;
      } else {
        console.error("No data found for course:", this.courseId);
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showAnswer = false; // Reset answer visibility
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false; // Reset answer visibility
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }
}