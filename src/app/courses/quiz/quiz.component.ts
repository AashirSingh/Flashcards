import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { Question, Topic, QuizData } from '../../shared/models/quiz.model'; // Import interfaces

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  questions: Question[] = []; // Array to hold questions
  currentQuestionIndex = 0; // Index for the current question
  options: string[] = []; // Options for the current question
  selectedOption: string = ''; // User-selected option
  correctAnswer: string = ''; // Correct answer for the current question
  selectionLocked = false; // Locks selection after user picks an answer
  correctAnswersCount = 0; // Tracks correct answers

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.loadQuestionsFromJson();
  }

  // Load questions from JSON file
  loadQuestionsFromJson(): void {
    this.http.get<QuizData>('/assets/python1A.json').subscribe(
      (data: QuizData) => {
        // Access the first topic's questions for demonstration purposes
        if (data.Python1A && data.Python1A.length > 0) {
          this.questions = data.Python1A[0].questions;
          this.loadCurrentQuestionOptions();
        } else {
          console.warn("No questions available in JSON data.");
        }
      },
      (error) => {
        console.error("Error loading JSON file:", error);
      }
    );
  }

  // Load options for the current question
  loadCurrentQuestionOptions(): void {
    if (this.questions.length > 0 && this.questions[this.currentQuestionIndex]) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      this.correctAnswer = currentQuestion.correct_answer;
      this.options = [...currentQuestion.options];
      this.selectedOption = ''; // Reset selected option for new question
      this.selectionLocked = false; // Allow selection for new question
    }
  }

  // Handle the selection of an answer
  selectOption(option: string): void {
    this.selectedOption = option;
    this.selectionLocked = true;
  }

  // Move to the next question or show results if at the end
  nextQuestion(): void {
    if (this.selectedOption === this.correctAnswer) {
      this.correctAnswersCount++;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentQuestionOptions();
    } else {
      this.showResults();
    }
  }

  //Use this for testing - completes quiz with all quetions correct after the first one - displays confetti
  // nextQuestion(): void {
  //   if (this.selectedOption === this.correctAnswer) {
  //     this.correctAnswersCount++;
  //   }
  
  //   // Temporarily set the score to max and trigger results for testing
  //   if (this.currentQuestionIndex >= 0) { // Change to 0 to end early
  //     this.correctAnswersCount = this.questions.length; // Pretend all answers are correct
  //     this.showResults();
  //   } else {
  //     this.currentQuestionIndex++;
  //     this.loadCurrentQuestionOptions();
  //   }
  // }
  

  // Show results in a modal at the end of the quiz
  async showResults(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: QuizResultsComponent,
      componentProps: {
        correctAnswers: this.correctAnswersCount,
        totalQuestions: this.questions.length
      }
    });
    await modal.present();
  }
}