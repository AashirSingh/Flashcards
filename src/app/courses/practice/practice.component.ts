import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { ModalController } from '@ionic/angular';
import { WriteModalComponent } from '../../dashboard/flashcard/write-modal/write-modal.component';
import { Howl } from 'howler';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId?: string;
  questions: Set[] = [];
  currentQuestionIndex = 0;
  showAnswer = false;
  isReadMode = true;
  isSanskritCourse = false; // Flag for Sanskrit course
  sound!: Howl;

  constructor(
    private configService: ConfigService,
    private modalController: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // First, check if `courseId` is provided through route parameter.
    if (!this.courseId) {
      this.route.paramMap.subscribe(params => {
        const idFromRoute = params.get('id');
        if (idFromRoute) {
          this.courseId = idFromRoute;
        }
        this.loadCourseData();
      });
    } else {
      // If courseId is passed as an @Input(), load the course data.
      this.loadCourseData();
    }
    console.log(this.courseId);
  }

  loadCourseData(): void {
    if (!this.courseId) {
      console.error("Course ID is not provided.");
      return;
    }

    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === +this.courseId!);
      console.log(course);
      if (course && course.components.practice) {
        this.questions = course.components.practice.questions as Set[];
        console.log("Questions loaded:", this.questions);

        // Check if the current course is Sanskrit
        if (course.name.toLowerCase() === 'sanskrit') {
          this.isSanskritCourse = true;
          this.loadSound(); // Load sound for Sanskrit course
        }
      } else {
        console.error("No data found for course:", this.courseId);
        this.questions = [];
      }
    });
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
