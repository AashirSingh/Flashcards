import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  studyMaterials: Question[] = []; // Array to hold study materials (all questions for the topic)
  private audio: HTMLAudioElement;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.audio = new Audio();
  }

  ngOnInit(): void {
    this.loadStudyMaterialsFromJson();
  }

  // Load study materials from JSON file
  loadStudyMaterialsFromJson(): void {
    this.http.get<QuizData>('/assets/python1A.json').subscribe(
      (data: QuizData) => {
        // Access the first topic's questions for demonstration purposes
        if (data.Python1A && data.Python1A.length > 0) {
          this.studyMaterials = data.Python1A[0].questions;
          this.playSound('/assets/sounds/study-material.mp3');
          console.log("Study materials loaded:", this.studyMaterials);
        } else {
          console.warn("No study materials available in JSON data.");
        }
      },
      (error) => {
        console.error("Error loading JSON file:", error);
      }
    );
  }

  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}
