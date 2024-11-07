import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { ModalController } from '@ionic/angular';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { HttpClient } from '@angular/common/http';
import { Question, Topic, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input() courseId?: string;
  questions: Set[] = [];
  currentQuestionIndex = 0;
  options: string[] = [];
  selectedOption: string = '';
  correctAnswer: string = '';
  selectionLocked = false;
  correctAnswersCount = 0;
  mode: string | null = null; // Property to store mode

  private audio: HTMLAudioElement;

  constructor(
    private configService: ConfigService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.audio = new Audio();
  }

  ngOnInit(): void {
    console.log("QuizComponent initialized");
    
    // Retrieve the mode from query parameters
    this.route.queryParamMap.subscribe(params => {
      this.mode = params.get('mode');
      console.log(`Quiz mode: ${this.mode}`);
    });

    // Retrieve courseId from route parameters if applicable
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || undefined;
      console.log(`Course ID: ${this.courseId}`);
      this.loadQuestions();
    });

    this.loadPythonJsonData();
  }

  loadPythonJsonData(): void {
    console.log("Attempting to load JSON data..."); // Debug log
    this.http.get<QuizData>('/assets/python1A.json').subscribe(
      (data: QuizData) => {
        console.log("JSON Data loaded:", data); // Confirm data load
        if (data.Python1A && Array.isArray(data.Python1A)) {
          data.Python1A.forEach((topic: Topic, topicIndex: number) => {
            console.log(`Topic ${topicIndex + 1}: ${topic.topic}`);
            topic.questions.forEach((question: Question, questionIndex: number) => {
              console.log(`  Question ${questionIndex + 1}: ${question.question}`);
              console.log(`  Options: ${question.options.join(', ')}`);
              console.log(`  Correct Answer: ${question.correct_answer}`);
            });
          });
        } else {
          console.warn("No 'Python1A' array found in the JSON data.");
        }
      },
      (error) => {
        console.error("Error loading JSON file:", error);
      }
    );
  }

  loadQuestions(): void {
    if (!this.courseId) {
      console.error("Course ID is not provided.");
      return;
    }

    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId!);
      if (course && course.components.practice) {
        this.questions = course.components.practice.questions as Set[];
        this.loadOptions();
      } else {
        console.error("No data found for course:", this.courseId);
        this.questions = [];
      }
    });
  }

  loadOptions(): void {
    if (this.questions.length > 0) {
      this.correctAnswer = this.questions[this.currentQuestionIndex].answer;
      this.options = this.generateOptions(this.correctAnswer);
      this.selectionLocked = false;
    }
  }

  generateOptions(correctAnswer: string): string[] {
    const allAnswers = this.questions.map(q => q.answer);
    const incorrectAnswers = allAnswers.filter(a => a !== correctAnswer);
    const selectedIncorrect = incorrectAnswers.slice(0, 3);
    return this.shuffleArray([correctAnswer, ...selectedIncorrect]);
  }

  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  selectOption(event: any): void {
    this.selectedOption = event.detail.value;
    this.selectionLocked = true;

    if (this.isCorrect()) {
      this.playSound('/assets/sounds/correct-answer.mp3');
    } else {
      this.playSound('/assets/sounds/wrong-answer.mp3');
    }
  }

  nextQuestion(): void {
    if (this.selectedOption === this.correctAnswer) {
      this.correctAnswersCount++;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = '';
      this.loadOptions();
      this.playSound('/assets/sounds/next-question.mp3');
    } else {
      this.showResults();
    }
  }

  isCorrect(): boolean {
    return this.selectedOption === this.correctAnswer;
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

  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}
