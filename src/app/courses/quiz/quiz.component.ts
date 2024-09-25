import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';

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

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  // Fetches questions for the quiz
  loadQuestions(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId);  // Ensure courseId is treated as a number
      if (course && course.components.practice) {
        this.questions = course.components.practice.questions as Set[];
        this.loadOptions();  // Load the options for the first question
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
  }

  // Proceed to the next question
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = '';  // Reset selected option
      this.loadOptions();  // Load new options for the next question
    }
  }

  // Check if the selected option is correct
  isCorrect(): boolean {
    return this.selectedOption === this.correctAnswer;
  }
}
