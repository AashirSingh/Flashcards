import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {
  @Input() correctAnswers: number = 0;
  @Input() totalQuestions: number = 0;

  constructor(private modalCtrl: ModalController) {} 

  ngOnInit(): void {
    if (this.passedQuiz()) {
      console.log("Quiz passed!");
    }
  }

  passedQuiz(): boolean {
    return this.correctAnswers / this.totalQuestions >= 0.7; // Pass if 70% or more correct
  }

  // Method to dismiss the modal
  dismiss(): void {
    this.modalCtrl.dismiss();
  }
}
