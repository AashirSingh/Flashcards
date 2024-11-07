import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { WriteModalComponent } from '../../dashboard/flashcard/write-modal/write-modal.component';
import { Howl } from 'howler';
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId?: string;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  showAnswer = false;
  isReadMode = true;
  isSanskritCourse = false; // Flag for Sanskrit course
  sound!: Howl;

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPracticeQuestionsFromJson();
  }

  loadPracticeQuestionsFromJson(): void {
    this.http.get<QuizData>('/assets/python1A.json').subscribe(
      (data: QuizData) => {
        // Access the first topic's questions for demonstration purposes
        if (data.Python1A && data.Python1A.length > 0) {
          this.questions = data.Python1A[0].questions;
          console.log("Practice questions loaded:", this.questions);
          this.checkIfSanskritCourse(); // Check if the current course is Sanskrit
        } else {
          console.warn("No practice questions available in JSON data.");
        }
      },
      (error) => {
        console.error("Error loading JSON file:", error);
      }
    );
  }

  checkIfSanskritCourse(): void {
    // Assuming that you can add some logic here to determine if the course is Sanskrit
    if (this.courseId === 'sanskrit') { // Replace with proper identification logic
      this.isSanskritCourse = true;
      this.loadSound(); // Load sound for Sanskrit course
    }
  }

  loadSound() {
    this.sound = new Howl({
      src: 'assets/sounds/4209177_livepiano__01c0_om-elo.wav',
      html5: true,
      onload: () => {
        console.log("Sound loaded successfully");
      },
      onplayerror: (error: any) => {
        console.error("Error while trying to play the sound:", error);
      },
      onplay: () => {
        console.log("Sound is playing");
      },
      onloaderror: (error: any) => {
        console.error("Failed to load sound:", error);
      }
    });
  }

  playSound() {
    if (this.sound) {
      this.sound.play();
    }
  }

  switchToReadMode() {
    this.isReadMode = true;
  }

  async openWriteModal() {
    const modal = await this.modalController.create({
      component: WriteModalComponent
    });
    return await modal.present();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showAnswer = false;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false;
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }
}
