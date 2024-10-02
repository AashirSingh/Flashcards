import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { ModalController } from '@ionic/angular';
import { QuizResultsComponent } from './quiz-results/quiz-results.component'; // Import the QuizResultsComponent

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input() courseId!: number;
  questions: Set[] = [];  // Array to hold the questions for the quiz
  currentQuestionIndex = 0;  // Keeps track of the current question
  options: string[] = [];  // Array to hold the multiple-choice options
  selectedOption: string = '';  // The user's selected answer
  correctAnswer: string = '';  // Holds the correct answer for the current question
  selectionLocked = false;  // Locks the selection after the user picks an answer
  correctAnswersCount = 0;  // Tracks the number of correct answers -

  private audio: HTMLAudioElement;

  constructor(private configService: ConfigService, private modalCtrl: ModalController) {
    this.audio = new Audio();
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  // Load questions from the ConfigService
  loadQuestions(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId);  
      if (course && course.components.practice) {
        this.questions = course.components.practice.questions as Set[];
        this.loadOptions();
      }
    });
  }

  // Load the multiple-choice options for the current question
  loadOptions(): void {
    if (this.questions.length > 0) {
      this.correctAnswer = this.questions[this.currentQuestionIndex].answer;  // Store the correct answer
      this.options = this.generateOptions(this.correctAnswer);
      this.selectionLocked = false;  // Allow selection when loading a new question
    }
  }

  // Generate the options, including the correct answer and some incorrect answers
  generateOptions(correctAnswer: string): string[] {
    const allAnswers = this.questions.map(q => q.answer);
    const incorrectAnswers = allAnswers.filter(a => a !== correctAnswer);
    
    // Select up to 3 incorrect answers
    const selectedIncorrect = incorrectAnswers.slice(0, 3);
    
    // Shuffle the correct answer with the selected incorrect answers
    return this.shuffleArray([correctAnswer, ...selectedIncorrect]);
  }

  // Shuffle the options for randomness
  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Handle option selection by the user
  selectOption(event: any): void {
    this.selectedOption = event.detail.value;
    this.selectionLocked = true;  // Lock selection after an option is selected

    if (this.isCorrect()) {
      this.playSound('/assets/sounds/correct-answer.mp3');  // Play correct answer sound
    } else {
      this.playSound('/assets/sounds/wrong-answer.mp3');  // Play wrong answer sound
    }
  }

  // Proceed to the next question or show results if the quiz is completed
  nextQuestion(): void {
    if (this.selectedOption === this.correctAnswer) {
      this.correctAnswersCount++;  // Increment correct answers count if the user answered correctly
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = '';  // Reset selected option
      this.loadOptions();  // Load new options for the next question
      this.playSound('/assets/sounds/next-question.mp3');  // Play sound for next question
    } else {
      this.showResults();  // Show results when the quiz ends
    }
  }

  // Check if the selected option is correct
  isCorrect(): boolean {
    return this.selectedOption === this.correctAnswer;
  }

  // Display the results modal
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

  // Method to play sound based on the provided file path
  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}
