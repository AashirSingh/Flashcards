import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { ModalController } from '@ionic/angular';
import { WriteModalComponent } from '../../dashboard/flashcard/write-modal/write-modal.component'; 

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId!: string;
  questions: Set[] = [];  // Array to hold the questions fetched from the course
  currentQuestionIndex = 0;  // Keeps track of the current question in the practice session
  showAnswer = false;  // Controls whether the answer is visible

  isReadMode = true;  // Determines whether the component is in Read or Write mode

  constructor(private configService: ConfigService, private modalController: ModalController) {}

  ngOnInit(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId);  // Convert courseId to a number for comparison
      if (course && course.components.practice) {
        this.questions = course.components.practice.questions as Set[];  // Fetch questions from the practice component
        console.log("Questions loaded:", this.questions);
      } else {
        console.error("No data found for course:", this.courseId);
        this.questions = [];  // Ensure questions is an empty array if none found
      }
    });
  }

  // Switch to Read mode
  switchToReadMode() {
    this.isReadMode = true;
  }

  // Open the write modal
  async openWriteModal() {
    const modal = await this.modalController.create({
      component: WriteModalComponent
    });
    return await modal.present();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showAnswer = false;  // Reset answer visibility when moving to the next question
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false;  // Reset answer visibility when moving to the previous question
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;  // Toggle the visibility of the answer
  }
}