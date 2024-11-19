// Updated StudyComponent
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  @Input() courseId?: string;
  studyMaterials: Question[] = []; // Array to hold study materials (all questions for the topic)
  private audio: HTMLAudioElement;

  constructor(private storage: AngularFireStorage) {
    this.audio = new Audio();
  }

  ngOnInit(): void {
    this.loadStudyMaterialsFromFirebase();
  }

  loadStudyMaterialsFromFirebase(): void {
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
              this.studyMaterials = data[this.courseId][0].questions;
              this.playSound('/assets/sounds/study-material.mp3');
            }
          });
      },
      (error: any) => {
        console.error('Error loading JSON file from Firebase:', error);
      }
    );
  }

  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}
