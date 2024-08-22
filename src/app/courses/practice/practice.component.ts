import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId!: string;
  questions!: any[]; // This should be replaced with the actual type
  currentQuestionIndex = 0;

  constructor() { }

  ngOnInit(): void {
    // Load questions based on courseId, for example from a service
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // Maybe show a completion message or handle the end of the practice session
    }
  }

  checkAnswer(selectedAnswer: string): void {
    // Logic to check the selected answer against the correct one
  }
}