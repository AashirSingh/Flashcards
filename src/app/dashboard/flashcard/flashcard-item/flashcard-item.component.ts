import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flashcard-item',
  templateUrl: './flashcard-item.component.html',
  styleUrls: ['./flashcard-item.component.scss'],
})
export class FlashcardItemComponent implements OnInit {
  question: string;
  answer: string;
  showAnswer: boolean = false;

  constructor() {
    this.question = 'What is the capital of France?';
    this.answer = 'The capital of France is Paris.';
  }

  ngOnInit() {}

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
  }
}
