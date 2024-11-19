// Updated QuizComponent
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController } from '@ionic/angular';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input() courseId?: string;
  questions: Question[] = []; // Array to hold questions
  currentQuestionIndex = 0; // Index for the current question
  options: string[] = []; // Options for the current question
  selectedOption: string = ''; // User-selected option
  correctAnswer: string = ''; // Correct answer for the current question
  selectionLocked = false; // Locks selection after user picks an answer
  correctAnswersCount = 0; // Tracks correct answers

  constructor(
    private storage: AngularFireStorage,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.loadQuestionsFromFirebase();
  }

  loadQuestionsFromFirebase(): void {
    if (!this.courseId) {
      console.error('Course ID is not provided.');
      return;
    }

    const filePath = `json/${this.courseId}.json`;
    const fileRef = this.storage.ref(filePath);

    fileRef.getDownloadURL().subscribe(
      (url: string) => {
        fetch(url)
          .then((response) => response.json())
          .then((data: any) => {
            if (this.courseId && data[this.courseId] && data[this.courseId].length > 0) {
              this.questions = data[this.courseId][0].questions;
              this.loadCurrentQuestionOptions();
            } else {
              console.warn('No questions available in JSON data.');
            }
          });
      },
      (error: any) => {
        console.error('Error loading JSON file from Firebase:', error);
      }
    );
  }

  loadCurrentQuestionOptions(): void {
    if (this.questions.length > 0 && this.questions[this.currentQuestionIndex]) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      this.correctAnswer = currentQuestion.correct_answer;
      this.options = [...currentQuestion.options];
      this.selectedOption = ''; // Reset selected option for new question
      this.selectionLocked = false; // Allow selection for new question
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.selectionLocked = true;
  }

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