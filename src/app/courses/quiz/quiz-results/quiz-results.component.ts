import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-results',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Quiz Results</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Your Score: {{ correctAnswers }} / {{ totalQuestions }}</h2>
    </ion-content>
  `
})
export class QuizResultsComponent {
  @Input() correctAnswers: number = 0;
  @Input() totalQuestions: number = 0;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
